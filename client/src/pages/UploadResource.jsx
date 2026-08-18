import { Alert, Button, FileInput, Select, TextInput, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function UploadResource() {
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    fileUrl: '',
  });
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUploadFile = async () => {
    try {
      if (!file) {
        setFileUploadError('Please select a PDF file');
        return;
      }

      if (file.type !== 'application/pdf') {
        setFileUploadError('Only PDF files are allowed');
        return;
      }

      // Max 10MB
      if (file.size > 10 * 1024 * 1024) {
        setFileUploadError('File size must be less than 10MB');
        return;
      }

      setFileUploadError(null);
      setFileUploadProgress(10); // Start loading

      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch(`${BACKEND_URL}/api/upload/pdf`, {
        method: 'POST',
        body: uploadData,
      });

      setFileUploadProgress(60);
      const data = await res.json();

      if (!res.ok) {
        setFileUploadError(data.message || 'File upload failed');
        setFileUploadProgress(null);
        return;
      }

      setFileUploadProgress(100);
      setTimeout(() => {
        setFileUploadProgress(null);
        setFileUploadError(null);
        setFormData({ ...formData, fileUrl: data.url });
      }, 500);

    } catch (error) {
      setFileUploadError('Something went wrong');
      setFileUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);
    setPublishSuccess(null);
    setLoading(true);

    if (!formData.title || !formData.description || !formData.category) {
      setPublishError('Please fill all fields');
      setLoading(false);
      return;
    }

    if (!formData.fileUrl) {
      setPublishError('Please upload a PDF file first');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/resource/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming authorization token is managed via cookies like the rest of the app
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        setLoading(false);
        return;
      }

      setPublishSuccess('Resource uploaded successfully!');
      setLoading(false);
      
      // Reset form
      setTimeout(() => {
        setFormData({ title: '', description: '', category: 'Other', fileUrl: '' });
        setFile(null);
        setPublishSuccess(null);
      }, 2000);

    } catch (error) {
      setPublishError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Upload a Resource</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        
        <TextInput
          type='text'
          placeholder='Resource Title (e.g. Trees and Graphs Cheatsheet)'
          required
          id='title'
          className='flex-1'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <Textarea
          placeholder='Write a short description of this resource...'
          required
          id='description'
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <Select
          id='category'
          required
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value='Other'>Other</option>
          <option value='DSA'>DSA</option>
          <option value='Operating System'>Operating System</option>
          <option value='DBMS'>DBMS</option>
        </Select>

        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='application/pdf'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUploadFile}
            disabled={fileUploadProgress !== null}
          >
            {fileUploadProgress !== null ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={fileUploadProgress}
                  text={`${fileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload PDF'
            )}
          </Button>
        </div>

        {fileUploadError && <Alert color='failure'>{fileUploadError}</Alert>}
        
        {formData.fileUrl && (
          <Alert color='success'>File uploaded successfully. Ready to publish!</Alert>
        )}

        <Button 
          type='submit' 
          gradientDuoTone='purpleToPink' 
          disabled={loading}
          className='mt-4'
        >
          {loading ? 'Publishing...' : 'Publish Resource'}
        </Button>
        
        {publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>}
        {publishSuccess && <Alert color='success' className='mt-5'>{publishSuccess}</Alert>}
      </form>
    </div>
  );
}
