import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import OTPModal from '../components/OTPModal';
import TimedAlert from '../components/TimedAlert';

// Backend URL with fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * SignUp Page with OTP Email Verification
 * 
 * Flow:
 * 1. User fills in username, email, password
 * 2. Click "Sign Up" → Sends OTP to email
 * 3. OTP Modal appears → User enters 6-digit code
 * 4. Verify OTP → Account created → Redirect to Sign In
 */
export default function SignUp() {
    // Form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    // UI state
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // OTP Modal state
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState(null);

    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    // Handle form submit - Send OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        // Validate fields
        if (!formData.username || !formData.email || !formData.password) {
            return setErrorMessage('Please fill out all fields.');
        }

        if (formData.password.length < 6) {
            return setErrorMessage('Password must be at least 6 characters.');
        }

        try {
            setLoading(true);

            // Send OTP to email
            const res = await fetch(
                `${BACKEND_URL}/api/otp/send-signup-otp`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                }
            );
            const data = await res.json();
            setLoading(false);

            if (!res.ok || data.success === false) {
                return setErrorMessage(data.message || 'Something went wrong');
            }

            // Show OTP modal
            setSuccessMessage(data.message);
            setShowOTPModal(true);

        } catch (error) {
            setErrorMessage(error.message);
            setLoading(false);
        }
    };

    // Handle OTP verification
    const handleVerifyOTP = async (otp) => {
        setOtpError(null);

        try {
            setOtpLoading(true);

            const res = await fetch(
                `${BACKEND_URL}/api/otp/verify-signup-otp`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        otp
                    }),
                }
            );
            const data = await res.json();
            setOtpLoading(false);

            if (!res.ok || data.success === false) {
                return setOtpError(data.message || 'Invalid OTP');
            }

            // Success - close modal and redirect
            setShowOTPModal(false);
            setSuccessMessage(data.message || 'Account created successfully!');

            // Redirect to sign in after 2 seconds
            setTimeout(() => {
                navigate('/sign-in');
            }, 2000);

        } catch (error) {
            setOtpError(error.message);
            setOtpLoading(false);
        }
    };

    // Handle OTP resend
    const handleResendOTP = async () => {
        setOtpError(null);

        try {
            const res = await fetch(
                `${BACKEND_URL}/api/otp/resend-signup-otp`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email }),
                }
            );
            const data = await res.json();

            if (!res.ok || data.success === false) {
                return setOtpError(data.message || 'Failed to resend OTP');
            }

            // OTP resent successfully - modal will show countdown
        } catch (error) {
            setOtpError(error.message);
        }
    };

    // Handle OTP modal close
    const handleCloseOTPModal = () => {
        setShowOTPModal(false);
        setOtpError(null);
    };

    return (
        <div className='min-h-screen mt-20'>
            <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
                {/* Left side - Logo and description */}
                <div className='flex-1'>
                    <Link to='/' className='font-bold dark:text-white text-4xl flex items-center gap-2'>
                        <img src='/logo.png' alt='Z Blogs' className='h-12 w-12 rounded' />
                        <span className='text-gray-900 dark:text-white'>Blogs</span>
                    </Link>
                    <p className='text-sm mt-5 text-gray-600 dark:text-gray-400'>
                        This is a blogging platform. You can sign up with your email and password
                        or with Google.
                    </p>
                </div>

                {/* Right side - Form */}
                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        {/* Username Input */}
                        <div>
                            <Label value='Your username' className='text-gray-700 dark:text-gray-300' />
                            <TextInput
                                type='text'
                                placeholder='Username'
                                id='username'
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <Label value='Your email' className='text-gray-700 dark:text-gray-300' />
                            <TextInput
                                type='email'
                                placeholder='name@gmail.com'
                                id='email'
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <Label value='Your password' className='text-gray-700 dark:text-gray-300' />
                            <TextInput
                                type='password'
                                placeholder='Password (min 6 characters)'
                                id='password'
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type='submit'
                            disabled={loading}
                            className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border-0'
                        >
                            {loading ? (
                                <>
                                    <Spinner size='sm' />
                                    <span className='pl-3'>Sending OTP...</span>
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>

                        {/* OAuth */}
                        <OAuth />
                    </form>

                    {/* Sign In Link */}
                    <div className='flex gap-2 text-sm mt-5'>
                        <span className='text-gray-600 dark:text-gray-400'>Have an account?</span>
                        <Link to='/sign-in' className='text-purple-600 dark:text-purple-400 hover:underline'>
                            Sign In
                        </Link>
                    </div>

                    {/* Success Message */}
                    {successMessage && !showOTPModal && (
                        <TimedAlert color='success' duration={5000} onClose={() => setSuccessMessage(null)}>
                            {successMessage}
                        </TimedAlert>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <TimedAlert color='failure' duration={5000} onClose={() => setErrorMessage(null)}>
                            {errorMessage}
                        </TimedAlert>
                    )}
                </div>
            </div>

            {/* OTP Verification Modal */}
            <OTPModal
                show={showOTPModal}
                onClose={handleCloseOTPModal}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                email={formData.email}
                loading={otpLoading}
                error={otpError}
                title="Verify Your Email"
            />
        </div>
    );
}
