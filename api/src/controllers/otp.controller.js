import OTP from '../models/otp.model.js';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';
import {
    generateOTP,
    sendSignupOTP,
    sendEmailChangeOTP,
    sendWelcomeEmail,
    sendProfileUpdateOTP
} from '../utils/emailService.js';

/**
 * OTP Controller
 * Handles all OTP-related operations
 */

/**
 * Send OTP for signup verification
 * POST /api/otp/send-signup-otp
 * Body: { username, email, password }
 */
export const sendSignupOTPController = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return next(errorHandler(400, 'All fields are required'));
    }

    if (password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
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

        // Delete any existing OTP for this email
        await OTP.deleteMany({ email, purpose: 'signup' });

        // Generate new OTP
        const otp = generateOTP();

        // Hash password before storing
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // Save OTP with pending user data
        const newOTP = new OTP({
            email,
            otp,
            purpose: 'signup',
            pendingUserData: {
                username,
                password: hashedPassword,
            },
        });
        await newOTP.save();

        // Send OTP email
        try {
            await sendSignupOTP(email, otp, username);
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
            // Continue - OTP is saved, user can use it even if email fails
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email. Please verify within 5 minutes.',
        });
    } catch (error) {
        console.error('Send signup OTP error:', error);
        next(errorHandler(500, 'Failed to send OTP. Please try again.'));
    }
};

/**
 * Verify OTP and complete signup
 * POST /api/otp/verify-signup-otp
 * Body: { email, otp }
 */
export const verifySignupOTPController = async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(errorHandler(400, 'Email and OTP are required'));
    }

    try {
        // Find the OTP record
        const otpRecord = await OTP.findOne({
            email,
            otp,
            purpose: 'signup'
        });

        if (!otpRecord) {
            return next(errorHandler(400, 'Invalid or expired OTP'));
        }

        // Create the user
        const newUser = new User({
            username: otpRecord.pendingUserData.username,
            email: otpRecord.email,
            password: otpRecord.pendingUserData.password,
        });
        await newUser.save();

        // Delete the OTP record
        await OTP.deleteOne({ _id: otpRecord._id });

        // Send welcome email (non-blocking)
        sendWelcomeEmail(email, otpRecord.pendingUserData.username);

        res.status(201).json({
            success: true,
            message: 'Email verified successfully! You can now sign in.',
        });
    } catch (error) {
        console.error('Verify signup OTP error:', error);
        next(errorHandler(500, 'Failed to verify OTP. Please try again.'));
    }
};

/**
 * Resend OTP for signup
 * POST /api/otp/resend-signup-otp
 * Body: { email }
 */
export const resendSignupOTPController = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(errorHandler(400, 'Email is required'));
    }

    try {
        // Find existing OTP record
        const existingOTP = await OTP.findOne({ email, purpose: 'signup' });

        if (!existingOTP) {
            return next(errorHandler(400, 'No pending verification found. Please sign up again.'));
        }

        // Generate new OTP
        const newOtp = generateOTP();

        // Update OTP and reset expiry
        existingOTP.otp = newOtp;
        existingOTP.createdAt = new Date();
        await existingOTP.save();

        // Send new OTP email
        await sendSignupOTP(email, newOtp, existingOTP.pendingUserData.username);

        res.status(200).json({
            success: true,
            message: 'New OTP sent to your email.',
        });
    } catch (error) {
        console.error('Resend signup OTP error:', error);
        next(errorHandler(500, 'Failed to resend OTP. Please try again.'));
    }
};

/**
 * Send OTP for email change verification
 * POST /api/otp/send-email-change-otp
 * Body: { newEmail }
 * Requires: Authentication (verifyToken middleware)
 */
export const sendEmailChangeOTPController = async (req, res, next) => {
    const { newEmail } = req.body;
    const userId = req.user.id;

    if (!newEmail) {
        return next(errorHandler(400, 'New email is required'));
    }

    try {
        // Get current user
        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        // Check if new email is same as current
        if (user.email === newEmail) {
            return next(errorHandler(400, 'New email is same as current email'));
        }

        // Check if email is taken by another user
        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return next(errorHandler(400, 'Email is already in use'));
        }

        // Delete any existing OTP for this purpose
        await OTP.deleteMany({ email: newEmail, purpose: 'email-change' });

        // Generate OTP
        const otp = generateOTP();

        // Save OTP
        const newOTP = new OTP({
            email: newEmail,
            otp,
            purpose: 'email-change',
        });
        await newOTP.save();

        // Send OTP email
        await sendEmailChangeOTP(newEmail, otp, user.username);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your new email. Please verify within 5 minutes.',
        });
    } catch (error) {
        console.error('Send email change OTP error:', error);
        next(errorHandler(500, 'Failed to send OTP. Please try again.'));
    }
};

/**
 * Verify OTP and update email
 * POST /api/otp/verify-email-change-otp
 * Body: { newEmail, otp }
 * Requires: Authentication (verifyToken middleware)
 */
export const verifyEmailChangeOTPController = async (req, res, next) => {
    const { newEmail, otp } = req.body;
    const userId = req.user.id;

    if (!newEmail || !otp) {
        return next(errorHandler(400, 'Email and OTP are required'));
    }

    try {
        // Find the OTP record
        const otpRecord = await OTP.findOne({
            email: newEmail,
            otp,
            purpose: 'email-change',
        });

        if (!otpRecord) {
            return next(errorHandler(400, 'Invalid or expired OTP'));
        }

        // Update user's email
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { email: newEmail },
            { new: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        // Delete the OTP record
        await OTP.deleteOne({ _id: otpRecord._id });

        // Return updated user (without password)
        const { password, ...rest } = updatedUser._doc;

        res.status(200).json({
            success: true,
            message: 'Email updated successfully!',
            ...rest,
        });
    } catch (error) {
        console.error('Verify email change OTP error:', error);
        next(errorHandler(500, 'Failed to verify OTP. Please try again.'));
    }
};

/**
 * Verify user password (for profile updates)
 * POST /api/otp/verify-password
 * Body: { password }
 * Requires: Authentication (verifyToken middleware)
 */
export const verifyPasswordController = async (req, res, next) => {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
        return next(errorHandler(400, 'Password is required'));
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid) {
            return next(errorHandler(400, 'Invalid password'));
        }

        res.status(200).json({
            success: true,
            message: 'Password verified',
        });
    } catch (error) {
        console.error('Verify password error:', error);
        next(errorHandler(500, 'Failed to verify password'));
    }
};

/**
 * Send OTP to current email for profile update verification
 * POST /api/otp/send-profile-update-otp
 * Body: { currentEmail, updates: { username?, email?, profilePicture? } }
 * Requires: Authentication (verifyToken middleware)
 */
export const sendProfileUpdateOTPController = async (req, res, next) => {
    const { currentEmail, updates } = req.body;
    const userId = req.user.id;

    if (!currentEmail) {
        return next(errorHandler(400, 'Current email is required'));
    }

    try {
        // Verify the user
        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        // Verify the email matches
        if (user.email !== currentEmail) {
            return next(errorHandler(400, 'Email does not match'));
        }

        // If username is being changed, check if it's taken
        if (updates.username && updates.username !== user.username) {
            const existingUsername = await User.findOne({ username: updates.username });
            if (existingUsername) {
                return next(errorHandler(400, 'Username already taken'));
            }
        }

        // If email is being changed, check if it's taken
        if (updates.email && updates.email !== user.email) {
            const existingEmail = await User.findOne({ email: updates.email });
            if (existingEmail) {
                return next(errorHandler(400, 'Email already in use'));
            }
        }

        // Delete any existing OTP for this purpose
        await OTP.deleteMany({ email: currentEmail, purpose: 'profile-update' });

        // Generate OTP
        const otp = generateOTP();

        // Save OTP with pending updates
        const newOTP = new OTP({
            email: currentEmail,
            otp,
            purpose: 'profile-update',
            pendingUserData: updates,
        });
        await newOTP.save();

        // Send OTP to current email
        try {
            await sendProfileUpdateOTP(currentEmail, otp, user.username);
        } catch (emailError) {
            console.error('Email sending failed:', emailError.message);
        }

        res.status(200).json({
            success: true,
            message: 'Verification code sent to your email.',
        });
    } catch (error) {
        console.error('Send profile update OTP error:', error);
        next(errorHandler(500, 'Failed to send verification code'));
    }
};

/**
 * Verify OTP and apply profile updates
 * POST /api/otp/verify-profile-update-otp
 * Body: { email, otp, updates: { username?, email?, profilePicture? } }
 * Requires: Authentication (verifyToken middleware)
 */
export const verifyProfileUpdateOTPController = async (req, res, next) => {
    const { email, otp, updates } = req.body;
    const userId = req.user.id;

    if (!email || !otp) {
        return next(errorHandler(400, 'Email and OTP are required'));
    }

    try {
        // Find the OTP record
        const otpRecord = await OTP.findOne({
            email,
            otp,
            purpose: 'profile-update',
        });

        if (!otpRecord) {
            return next(errorHandler(400, 'Invalid or expired verification code'));
        }

        // Build update object
        const updateFields = {};
        if (updates.username) updateFields.username = updates.username;
        if (updates.email) updateFields.email = updates.email;
        if (updates.profilePicture) updateFields.profilePicture = updates.profilePicture;

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, 'User not found'));
        }

        // Delete the OTP record
        await OTP.deleteOne({ _id: otpRecord._id });

        // Return updated user (without password)
        const { password, ...rest } = updatedUser._doc;

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully!',
            ...rest,
        });
    } catch (error) {
        console.error('Verify profile update OTP error:', error);
        next(errorHandler(500, 'Failed to update profile'));
    }
};
