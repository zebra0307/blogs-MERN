import { useState } from 'react';
import { Button, TextInput, Textarea, Alert } from 'flowbite-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Make sure you add VITE_WEB3FORMS_KEY to your .env file
    const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

    if (!WEB3FORMS_KEY) {
      setStatus('error_key');
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          ...formData,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Unknown error from Web3Forms');
        console.error('Web3Forms Error:', result);
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Network error occurred');
      console.error('Fetch Error:', error);
    }
  };

  return (
    <div className='min-h-screen max-w-2xl mx-auto px-4 py-16'>
      <div className='text-center mb-10'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Get in Touch
        </h1>
        <p className='mt-4 text-gray-600 dark:text-gray-400'>
          Have a question, suggestion, or just want to say hi? Send a message below and I will get back to you as soon as possible.
        </p>
      </div>

      <div className='bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
          <div>
            <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Your Name
            </label>
            <TextInput
              id='name'
              type='text'
              placeholder='John Doe'
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Your Email
            </label>
            <TextInput
              id='email'
              type='email'
              placeholder='name@company.com'
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='message' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
              Your Message
            </label>
            <Textarea
              id='message'
              placeholder='Leave a message...'
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <Button
            type='submit'
            disabled={status === 'sending'}
            className='bg-teal-600 hover:bg-teal-700'
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </Button>

          {status === 'success' && (
            <Alert color='success'>Message sent successfully! I will get back to you soon.</Alert>
          )}
          {status === 'error' && (
            <Alert color='failure'>{errorMessage || 'Something went wrong. Please try again later.'}</Alert>
          )}
          {status === 'error_key' && (
            <Alert color='warning'>
              Error: Web3Forms access key is missing! Please configure `VITE_WEB3FORMS_KEY` in your `.env` file.
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
