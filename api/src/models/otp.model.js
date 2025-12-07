import mongoose from 'mongoose';

/**
 * OTP Model
 * Stores One-Time Passwords for email verification
 * 
 * Fields:
 * - email: The email address to verify
 * - otp: The 6-digit OTP code
 * - purpose: What the OTP is for ('signup', 'email-change', 'password-reset')
 * - expiresAt: Auto-delete after this time (5 minutes)
 * - createdAt: When the OTP was created
 */
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    otp: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: ['signup', 'email-change', 'password-reset'],
        default: 'signup',
    },
    // Store pending user data for signup verification
    pendingUserData: {
        username: String,
        password: String, // Already hashed
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // Auto-delete after 5 minutes (300 seconds)
    },
});

// Index for faster queries
otpSchema.index({ email: 1, purpose: 1 });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
