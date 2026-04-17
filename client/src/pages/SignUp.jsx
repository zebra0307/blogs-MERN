import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
    signOut,
    updateProfile,
} from 'firebase/auth';
import OAuth from '../components/OAuth';
import TimedAlert from '../components/TimedAlert';
import { app } from '../firebase';
import {
    getPasswordValidationError,
    PASSWORD_REQUIREMENTS_HINT,
} from '../utils/passwordValidation';

const auth = getAuth(app);

const mapFirebaseSignupError = (error) => {
    if (!error?.code) {
        return error?.message || 'Failed to create account. Please try again.';
    }

    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is already in use. Please sign in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return PASSWORD_REQUIREMENTS_HINT;
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again in a few minutes.';
        default:
            return error.message || 'Failed to create account. Please try again.';
    }
};

/**
 * SignUp Page with Firebase Email Verification
 * 
 * Flow:
 * 1. User signs up with email/password
 * 2. Firebase sends verification email
 * 3. User verifies email from inbox
 * 4. User signs in from Sign In page
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

    const navigate = useNavigate();

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    // Handle form submit - Firebase signup and verification email
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        // Validate fields
        if (!formData.username || !formData.email || !formData.password) {
            return setErrorMessage('Please fill out all fields.');
        }

        const passwordValidationError = getPasswordValidationError(formData.password);
        if (passwordValidationError) {
            return setErrorMessage(passwordValidationError);
        }

        const normalizedUsername = formData.username.toLowerCase();
        if (normalizedUsername.length < 3 || normalizedUsername.length > 20) {
            return setErrorMessage('Username must be between 3 and 20 characters.');
        }
        if (!/^[a-z0-9]+$/.test(normalizedUsername)) {
            return setErrorMessage('Username can only contain lowercase letters and numbers.');
        }

        try {
            setLoading(true);

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            await updateProfile(userCredential.user, {
                displayName: normalizedUsername,
            });

            await sendEmailVerification(userCredential.user);
            await signOut(auth);

            setSuccessMessage(
                'Account created. Verification email sent. Please verify your email before signing in.'
            );

            setTimeout(() => {
                navigate('/sign-in');
            }, 2200);

        } catch (error) {
            setErrorMessage(mapFirebaseSignupError(error));
        } finally {
            setLoading(false);
        }
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
                        Create an account with Firebase email/password or continue with Google.
                        You will need to verify your email before your first sign in.
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
                                placeholder='Create a strong password'
                                id='password'
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                                {PASSWORD_REQUIREMENTS_HINT}
                            </p>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type='submit'
                            disabled={loading}
                            className='bg-linear-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border-0'
                        >
                            {loading ? (
                                <>
                                    <Spinner size='sm' />
                                    <span className='pl-3'>Creating account...</span>
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
                    {successMessage && (
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
        </div>
    );
}
