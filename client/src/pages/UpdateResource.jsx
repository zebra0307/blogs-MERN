import { Alert, Button, FileInput, Select, TextInput, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function UpdateResource() {
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'DBMS',
    fileUrl: '',
    content: '',
    order: 0,
  });
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const { resourceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/resource/getresources?resourceId=${resourceId}`);
        const data = await res.json();
        if (res.ok && data.resources.length > 0) {
          const resData = data.resources[0];
          setFormData({
            title: resData.title || '',
            description: resData.description || '',
            category: resData.category || 'DBMS',
            fileUrl: resData.fileUrl || '',
            content: resData.content || '',
            order: resData.order || 0,
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchResource();
  }, [resourceId]);

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
        setFormData((prev) => ({ ...prev, fileUrl: data.url }));
      }, 500);

    } catch (error) {
      setFileUploadError('Something went wrong');
      setFileUploadProgress(null);
      console.log(error);
    }
  };

  const handleDeletePDF = async () => {
    try {
      if (!formData.fileUrl) return;
      const res = await fetch(`${BACKEND_URL}/api/upload/delete-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl: formData.fileUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, fileUrl: '' }));
        setPublishSuccess('PDF removed successfully. Remember to update the resource to save changes.');
        setTimeout(() => setPublishSuccess(null), 3000);
      } else {
        setPublishError(data.message || 'Failed to remove PDF');
      }
    } catch (error) {
      setPublishError('Something went wrong while removing the PDF');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);
    setPublishSuccess(null);
    setLoading(true);

    if (!formData.title || !formData.category) {
      setPublishError('Please fill the title and category');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/resource/update/${resourceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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

      setPublishSuccess('Resource updated successfully!');
      setLoading(false);
      
      setTimeout(() => {
        setPublishSuccess(null);
      }, 2000);

    } catch (error) {
      setPublishError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update Resource</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        
        <TextInput
          type='text'
          placeholder='Topic Title (e.g. Joins)'
          required
          id='title'
          className='flex-1'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className='flex gap-4'>
          <Select
            id='category'
            required
            className='flex-1'
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value='DSA'>DSA</option>
            <option value='Operating System'>Operating System</option>
            <option value='DBMS'>DBMS</option>
            <option value='System Design'>System Design</option>
          </Select>

          <TextInput
            type='number'
            placeholder='Order Index (e.g. 1)'
            id='order'
            className='w-32'
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            helperText="Sidebar order"
          />
        </div>

        <Textarea
          placeholder='Write a short description or excerpt...'
          id='description'
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <ReactQuill
          theme='snow'
          placeholder='Write the full topic notes here...'
          className='h-72 mb-12'
          value={formData.content}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, content: value }));
          }}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image', 'video'],
              ['clean']
            ]
          }}
        />

        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='application/pdf'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            className='bg-linear-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white! border-0'
            size='sm'
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
              'Upload New PDF'
            )}
          </Button>
        </div>

        {fileUploadError && <Alert color='failure'>{fileUploadError}</Alert>}
        
        {formData.fileUrl && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-lg">
            <span className="text-green-800 dark:text-green-400 text-sm font-medium truncate w-full">
              File ready! ({formData.fileUrl})
            </span>
            <Button color="failure" size="sm" onClick={handleDeletePDF} type="button">
              Remove PDF
            </Button>
          </div>
        )}

        <Button 
          type='submit' 
          className='mt-4 w-full bg-linear-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white! border-0'
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Resource'}
        </Button>
        
        {publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>}
        {publishSuccess && <Alert color='success' className='mt-5'>{publishSuccess}</Alert>}
      </form>
    </div>
  );
}
