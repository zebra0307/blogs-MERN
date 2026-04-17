import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { app } from '../firebase';

const auth = getAuth(app);

const mapResetError = (error) => {
  if (!error?.code || !String(error.code).startsWith('auth/')) {
    return error?.message || 'Failed to send reset email. Please try again.';
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again in a few minutes.';
    default:
      return error.message || 'Failed to send reset email. Please try again.';
  }
};

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, normalizedEmail);
      setSuccessMessage('Password reset email sent. Check your inbox and follow the link.');
    } catch (error) {
      setErrorMessage(mapResetError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl flex items-center gap-2'>
            <img src='/logo.png' alt='Z Blogs' className='h-12 w-12 rounded' />
            <span className='text-gray-900 dark:text-white'>Blogs</span>
          </Link>
          <p className='text-sm mt-5 text-gray-600 dark:text-gray-400'>
            Enter your account email and we will send a Firebase password reset link.
          </p>
        </div>

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' className='text-gray-700 dark:text-gray-300' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button
              type='submit'
              disabled={loading}
              className='bg-linear-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border-0'
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Sending...</span>
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span className='text-gray-600 dark:text-gray-400'>Remember your password?</span>
            <Link to='/sign-in' className='text-blue-500 hover:underline'>
              Sign In
            </Link>
          </div>

          {successMessage && (
            <Alert className='mt-5' color='success'>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
