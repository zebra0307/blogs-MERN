import { Button, Modal, ModalHeader, ModalBody, TextInput } from 'flowbite-react';
import { useState, useEffect, useRef } from 'react';
import TimedAlert from './TimedAlert';

/**
 * OTP Modal Component
 * 
 * A reusable modal for entering 6-digit OTP codes.
 * Features:
 * - 6 separate input boxes for each digit
 * - Auto-focus on next input
 * - Countdown timer
 * - Resend OTP functionality
 * 
 * Props:
 * @param {boolean} show - Whether to show the modal
 * @param {function} onClose - Function to close the modal
 * @param {function} onVerify - Function called with OTP when verify is clicked
 * @param {function} onResend - Function to resend OTP
 * @param {string} email - Email address OTP was sent to
 * @param {boolean} loading - Whether verification is in progress
 * @param {string} error - Error message to display
 * @param {string} title - Modal title (default: "Verify Your Email")
 */
export default function OTPModal({
    show,
    onClose,
    onVerify,
    onResend,
    email,
    loading = false,
    error = null,
    title = "Verify Your Email"
}) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const inputRefs = useRef([]);

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    // Countdown timer for OTP expiry
    useEffect(() => {
        if (show && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [show, countdown]);

    // Resend countdown timer
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setInterval(() => {
                setResendCountdown((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [resendCountdown]);

    // Reset state when modal opens
    useEffect(() => {
        if (show) {
            setOtp(['', '', '', '', '', '']);
            setCountdown(300);
            setCanResend(true);
            setResendCountdown(0);
            // Focus first input after a small delay
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }
    }, [show]);

    // Handle input change
    const handleChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle key down (for backspace navigation)
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pasteData)) {
            const newOtp = [...otp];
            pasteData.split('').forEach((digit, index) => {
                if (index < 6) newOtp[index] = digit;
            });
            setOtp(newOtp);
            // Focus the last filled input or the next empty one
            const focusIndex = Math.min(pasteData.length, 5);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    // Handle verify button click
    const handleVerify = () => {
        const otpString = otp.join('');
        if (otpString.length === 6) {
            onVerify(otpString);
        }
    };

    // Handle resend button click
    const handleResend = () => {
        if (canResend && onResend) {
            onResend();
            setCanResend(false);
            setResendCountdown(60); // 60 seconds before can resend again
            setCountdown(300); // Reset main countdown
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    };

    // Format countdown time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Check if OTP is complete
    const isOtpComplete = otp.every((digit) => digit !== '');

    return (
        <Modal show={show} onClose={onClose} popup size="md">
            <ModalHeader />
            <ModalBody>
                <div className="text-center">
                    {/* Title */}
                    <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                        {title}
                    </h3>

                    {/* Email display */}
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        We've sent a 6-digit code to
                    </p>
                    <p className="mb-6 text-sm font-medium text-gray-900 dark:text-white">
                        {email}
                    </p>

                    {/* OTP Input Boxes */}
                    <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                                disabled={loading}
                            />
                        ))}
                    </div>

                    {/* Countdown Timer */}
                    {countdown > 0 ? (
                        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                            Code expires in{' '}
                            <span className={`font-medium ${countdown < 60 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                {formatTime(countdown)}
                            </span>
                        </p>
                    ) : (
                        <p className="mb-4 text-sm text-red-500 font-medium">
                            Code has expired. Please request a new one.
                        </p>
                    )}

                    {/* Error Message */}
                    {error && (
                        <TimedAlert color="failure" duration={3000}>
                            {error}
                        </TimedAlert>
                    )}

                    {/* Verify Button */}
                    <Button
                        onClick={handleVerify}
                        disabled={!isOtpComplete || loading || countdown === 0}
                        className="w-full mb-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border-0"
                    >
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </Button>

                    {/* Resend Section */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Didn't receive the code?{' '}
                        {canResend ? (
                            <button
                                onClick={handleResend}
                                className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
                                disabled={loading}
                            >
                                Resend
                            </button>
                        ) : (
                            <span className="text-gray-500">
                                Resend in {resendCountdown}s
                            </span>
                        )}
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}
