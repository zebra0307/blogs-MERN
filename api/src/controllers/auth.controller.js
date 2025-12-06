import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

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

    const { password: pass, ...rest } = validUser._doc;

    // Cookie options for cross-site requests
    const cookieOptions = {
      httpOnly: true,
    };

    // In production, set sameSite and secure for cross-site cookies
    if (process.env.NODE_ENV === 'production') {
      cookieOptions.sameSite = 'none';
      cookieOptions.secure = true;
    }

    res.status(200).cookie('access_token', token, cookieOptions).json({
      success: true,
      ...rest,
    });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;

      // Cookie options for cross-site requests
      const cookieOptions = {
        httpOnly: true,
      };

      // In production, set sameSite and secure for cross-site cookies
      if (process.env.NODE_ENV === 'production') {
        cookieOptions.sameSite = 'none';
        cookieOptions.secure = true;
      }

      res.status(200).cookie('access_token', token, cookieOptions).json({
        success: true,
        ...rest,
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
      const { password, ...rest } = newUser._doc;

      // Cookie options for cross-site requests
      const cookieOptions = {
        httpOnly: true,
      };

      // In production, set sameSite and secure for cross-site cookies
      if (process.env.NODE_ENV === 'production') {
        cookieOptions.sameSite = 'none';
        cookieOptions.secure = true;
      }

      res.status(200).cookie('access_token', token, cookieOptions).json({
        success: true,
        ...rest,
      });
    }
  } catch (error) {
    next(error);
  }
};