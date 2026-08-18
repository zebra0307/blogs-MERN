import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useState, useRef } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { POST_CATEGORIES } from '../utils/categories';
import ResourceSelector from '../components/ResourceSelector';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const quillRef = useRef(null);

  const navigate = useNavigate();

  /**
   * Convert image file to Base64 string
   */
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }

      // Validate file size (max 500KB for post images)
      if (file.size > 500 * 1024) {
        setImageUploadError('Image must be less than 500KB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageUploadError('Please select an image file');
        return;
      }

      setImageUploadError(null);
      setImageUploadProgress(0);

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setImageUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Convert to Base64
      const base64 = await convertToBase64(file);

      clearInterval(progressInterval);
      setImageUploadProgress(100);
      setFormData({ ...formData, image: base64 });

      // Clear progress after a moment
      setTimeout(() => {
        setImageUploadProgress(null);
      }, 500);

    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleInsertResource = (resource) => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(true);
    
    if (resource.fileUrl) {
      editor.insertText(range.index, `\n[RESOURCE_EMBED:${resource._id}]\n`);
    } else {
      editor.insertText(range.index, ` [RESOURCE_LINK:${resource._id}|📘 Read ${resource.title} →] `);
    }
    
    setFormData((prev) => ({
      ...prev,
      attachedResources: prev.attachedResources?.includes(resource._id) 
        ? prev.attachedResources 
        : [...(prev.attachedResources || []), resource._id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishError(null);
    setPublishSuccess(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/post/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        if (currentUser?.isAdmin) {
          navigate(`/post/${data.slug}`);
        } else {
          setPublishSuccess('Post submitted successfully! It will be visible on the blog once approved by an admin.');
          setFormData({});
          setFile(null);
          // Scroll to bottom to see success message
          window.scrollTo(0, document.body.scrollHeight);
        }
      }
    } catch {
      setPublishError('Something went wrong');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value='uncategorized'>Select a category</option>
            {POST_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            size='sm'
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
            className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white'
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          ref={quillRef}
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          modules={modules}
          value={formData.content || ''}
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, content: value }));
          }}
        />
        <div className="flex justify-end -mt-8 mb-4">
          <ResourceSelector onInsert={handleInsertResource} />
        </div>
        <Button type='submit' className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white'>
          Publish
        </Button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
        {publishSuccess && (
          <Alert className='mt-5' color='success'>
            {publishSuccess}
          </Alert>
        )}
      </form>
    </div>
  );
}