import { useState } from 'react';
import { Button, TextInput, Alert, Spinner } from 'flowbite-react';

export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribers/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Subscription successful! Please check your email to verify.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to connect to the server.');
    }
  };

  return (
    <div className='w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700'>
      <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2 text-center'>
        Subscribe to my Newsletter
      </h3>
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-6 text-center'>
        Get notified when I publish new notes on data structures, web development, and systems.
      </p>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='relative'>
          <TextInput
            type='email'
            placeholder='you@example.com'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className='w-full'
          />
        </div>
        
        <Button 
          type='submit' 
          gradientDuoTone='tealToLime' 
          disabled={status === 'loading' || !email}
          className='w-full font-semibold'
        >
          {status === 'loading' ? (
            <>
              <Spinner size='sm' light={true} className='mr-2' />
              Subscribing...
            </>
          ) : (
            'Subscribe'
          )}
        </Button>
      </form>

      {status === 'success' && (
        <Alert color='success' className='mt-4'>
          {message}
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert color='failure' className='mt-4'>
          {message}
        </Alert>
      )}
    </div>
  );
}
