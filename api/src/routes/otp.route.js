import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
    sendSignupOTPController,
    verifySignupOTPController,
    resendSignupOTPController,
    sendEmailChangeOTPController,
    verifyEmailChangeOTPController,
    verifyPasswordController,
    sendProfileUpdateOTPController,
    verifyProfileUpdateOTPController,
} from '../controllers/otp.controller.js';

const router = express.Router();

/**
 * OTP Routes
 * 
 * Public routes (no auth required):
 * - POST /send-signup-otp      - Send OTP for signup
 * - POST /verify-signup-otp    - Verify signup OTP
 * - POST /resend-signup-otp    - Resend signup OTP
 * 
 * Protected routes (auth required):
 * - POST /send-email-change-otp       - Send OTP to new email
 * - POST /verify-email-change-otp     - Verify and update email
 * - POST /verify-password             - Verify current password
 * - POST /send-profile-update-otp     - Send OTP for profile update
 * - POST /verify-profile-update-otp   - Verify and apply profile updates
 */

// Public routes - for signup
router.post('/send-signup-otp', sendSignupOTPController);
router.post('/verify-signup-otp', verifySignupOTPController);
router.post('/resend-signup-otp', resendSignupOTPController);

// Protected routes - for profile updates
router.post('/send-email-change-otp', verifyToken, sendEmailChangeOTPController);
router.post('/verify-email-change-otp', verifyToken, verifyEmailChangeOTPController);
router.post('/verify-password', verifyToken, verifyPasswordController);
router.post('/send-profile-update-otp', verifyToken, sendProfileUpdateOTPController);
router.post('/verify-profile-update-otp', verifyToken, verifyProfileUpdateOTPController);

export default router;
