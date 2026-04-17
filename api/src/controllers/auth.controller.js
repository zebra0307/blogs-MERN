import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { getFirebaseAdminAuth } from '../utils/firebaseAdmin.js';
import { getPasswordValidationError } from '../utils/passwordValidation.js';

const DEFAULT_AVATAR =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

const getCookieOptions = () => {
  const cookieOptions = {
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.sameSite = 'none';
    cookieOptions.secure = true;
  }

  return cookieOptions;
};

const getPublicUserData = (user) => {
  const { password, ...rest } = user._doc;
  return rest;
};

const normalizeUsername = (value = '') => {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (normalized.length >= 3) {
    return normalized.slice(0, 20);
  }

  const fallback = `${normalized}user`;
  return fallback.slice(0, 20);
};

const generateUniqueUsername = async (seedValue) => {
  const base = normalizeUsername(seedValue || 'user');
  let candidate = base;

  while (await User.findOne({ username: candidate })) {
    const suffix = String(Math.floor(1000 + Math.random() * 9000));
    const maxBaseLength = Math.max(3, 20 - suffix.length);
    candidate = `${base.slice(0, maxBaseLength)}${suffix}`;
  }

  return candidate;
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    return next(errorHandler(400, 'All fields are required'));
  }

  const passwordValidationError = getPasswordValidationError(password);
  if (passwordValidationError) {
    return next(errorHandler(400, passwordValidationError));
  }

  try {
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return next(errorHandler(400, 'Username already exists'));
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(errorHandler(400, 'Email already exists'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Return proper JSON success response
    res.status(201).json({
      success: true,
      message: 'Signup successful! Please sign in.',
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    res.status(200).cookie('access_token', token, getCookieOptions()).json({
      success: true,
      ...getPublicUserData(validUser),
    });
  } catch (error) {
    next(error);
  }
};

export const firebaseAuth = async (req, res, next) => {
  const { idToken, username, googlePhotoUrl } = req.body;

  if (!idToken || idToken === '') {
    return next(errorHandler(400, 'Firebase ID token is required'));
  }

  try {
    const firebaseAdminAuth = getFirebaseAdminAuth();
    const decodedToken = await firebaseAdminAuth.verifyIdToken(idToken);

    if (!decodedToken.email) {
      return next(errorHandler(400, 'Firebase account must include an email'));
    }

    if (!decodedToken.email_verified) {
      return next(errorHandler(403, 'Please verify your email before signing in'));
    }

    const email = decodedToken.email.toLowerCase();
    const firebaseUid = decodedToken.uid;
    const firebasePhoto = decodedToken.picture || googlePhotoUrl;
    const firebaseName = decodedToken.name || username;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = await User.findOne({ email });
      if (user && !user.firebaseUid) {
        user.firebaseUid = firebaseUid;
      }
    }

    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const usernameSeed = firebaseName || email.split('@')[0];
      const uniqueUsername = await generateUniqueUsername(usernameSeed);

      user = new User({
        username: uniqueUsername,
        email,
        password: hashedPassword,
        profilePicture: firebasePhoto || DEFAULT_AVATAR,
        firebaseUid,
      });
    } else {
      if (user.email !== email) {
        const existingEmailUser = await User.findOne({
          email,
          _id: { $ne: user._id },
        });
        if (existingEmailUser) {
          return next(errorHandler(400, 'Email is already linked to another account'));
        }
        user.email = email;
      }

      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
      }

      if (firebasePhoto && user.profilePicture === DEFAULT_AVATAR) {
        user.profilePicture = firebasePhoto;
      }
    }

    await user.save();

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    res.status(200).cookie('access_token', token, getCookieOptions()).json({
      success: true,
      ...getPublicUserData(user),
    });
  } catch (error) {
    if (
      error?.code === 'auth/id-token-expired' ||
      error?.code === 'auth/argument-error' ||
      error?.code === 'auth/invalid-id-token'
    ) {
      return next(errorHandler(401, 'Invalid Firebase session. Please sign in again.'));
    }

    if (
      typeof error?.message === 'string' &&
      error.message.includes('Firebase Admin is not fully configured')
    ) {
      return next(errorHandler(500, error.message));
    }

    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // Update profile picture to Google photo if user has default avatar
      if (googlePhotoUrl && user.profilePicture === DEFAULT_AVATAR) {
        user.profilePicture = googlePhotoUrl;
        await user.save();
      }

      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );

      res.status(200).cookie('access_token', token, getCookieOptions()).json({
        success: true,
        ...getPublicUserData(user),
      });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );

      res.status(200).cookie('access_token', token, getCookieOptions()).json({
        success: true,
        ...getPublicUserData(newUser),
      });
    }
  } catch (error) {
    next(error);
  }
};