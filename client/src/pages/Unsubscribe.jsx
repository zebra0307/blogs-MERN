import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function Unsubscribe() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribeToken = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/subscribers/unsubscribe/${token}`);
        const data = await res.json();
        
        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'You have been successfully unsubscribed.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Invalid or expired unsubscribe link.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to connect to the server. Please try again later.');
      }
    };
    
    if (token) {
      unsubscribeToken();
    }
  }, [token]);

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900'>
      <div className='w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center'>
        {status === 'loading' && (
          <div className='flex flex-col items-center gap-4'>
            <Spinner size='xl' />
            <h2 className='text-xl font-semibold text-gray-700 dark:text-gray-300'>
              Unsubscribing...
            </h2>
          </div>
        )}
        
        {status === 'success' && (
          <div className='flex flex-col items-center gap-4'>
            <HiCheckCircle className='w-20 h-20 text-gray-400' />
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Unsubscribed
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              {message}
            </p>
            <Link to='/' className='mt-4'>
              <Button color='gray'>Return Home</Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className='flex flex-col items-center gap-4'>
            <HiXCircle className='w-20 h-20 text-red-500' />
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Action Failed
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              {message}
            </p>
            <Link to='/' className='mt-4'>
              <Button color='gray'>Return Home</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
