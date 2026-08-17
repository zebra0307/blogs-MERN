import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { curriculum } from '../data/curriculum';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function UploadPaper() {
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({
    session: '',
    branch: '',
    subject: '',
    year: '',
    semester: '',
    examType: '',
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

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    if (id === 'branch') {
      setFormData({ ...formData, branch: value, year: '', semester: '', examType: '', subject: '' });
    } else if (id === 'year') {
      setFormData({ ...formData, year: value, semester: '', examType: '', subject: '' });
    } else if (id === 'semester') {
      setFormData({ ...formData, semester: value, examType: '', subject: '' });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const getAvailableSemesters = () => {
    if (!formData.year) return [];
    const year = parseInt(formData.year);
    if (year === 1) return [1, 2];
    if (year === 2) return [3, 4];
    if (year === 3) return [5, 6];
    if (year === 4) return [7, 8];
    return [];
  };

  const availableSemesters = getAvailableSemesters();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fileUrl) {
      setPublishError('Please upload a PDF file before publishing.');
      return;
    }
    setLoading(true);
    setPublishSuccess(null);
    setPublishError(null);
    
    // Construct unique title from fields (without redundant examType)
    const constructedTitle = `${formData.subject} - Session ${formData.session}`;
    const submitData = { ...formData, title: constructedTitle };

    try {
      const res = await fetch(`${BACKEND_URL}/api/question-paper/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        setLoading(false);
        return;
      }

      setPublishError(null);
      setPublishSuccess('Question Paper published successfully! You can upload another one.');
      setLoading(false);
      // Clear file data to allow another upload
      setFile(null);
      setFormData({ ...formData, fileUrl: '' });
      // We don't clear other fields so the user can quickly upload related papers
    } catch (error) {
      console.log(error.message);
      setPublishError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Upload Question Paper</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        
        <div className='flex flex-col gap-4'>
          <label className='block text-sm font-medium'>Session</label>
          <Select id='session' required onChange={handleFilterChange} value={formData.session}>
            <option value=''>Select Session</option>
            <option value='2020-21'>2020-21</option>
            <option value='2021-22'>2021-22</option>
            <option value='2022-23'>2022-23</option>
            <option value='2023-24'>2023-24</option>
            <option value='2024-25'>2024-25</option>
            <option value='2025-26'>2025-26</option>
            <option value='2026-27'>2026-27</option>
            <option value='2027-28'>2027-28</option>
            <option value='2028-29'>2028-29</option>
            <option value='2029-30'>2029-30</option>
            <option value='2030-31'>2030-31</option>
          </Select>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-between'>
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>Branch</label>
            <Select id='branch' required onChange={handleFilterChange} value={formData.branch}>
              <option value=''>Select Branch</option>
              <option value='CSE'>Computer Science (CSE)</option>
              <option value='ECE'>Electronics (ECE)</option>
              <option value='EE'>Electrical (EE)</option>
              <option value='Mining'>Mining</option>
            </Select>
          </div>
          
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>Year</label>
            <Select id='year' required onChange={handleFilterChange} value={formData.year} disabled={!formData.branch}>
              <option value=''>{!formData.branch ? 'Select Branch first' : 'Select Year'}</option>
              <option value='1'>1st Year</option>
              <option value='2'>2nd Year</option>
              <option value='3'>3rd Year</option>
              <option value='4'>4th Year</option>
            </Select>
          </div>
          
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>Semester</label>
            <Select id='semester' required onChange={handleFilterChange} value={formData.semester} disabled={!formData.year}>
              <option value=''>{!formData.year ? 'Select Year first' : 'Select Semester'}</option>
              {availableSemesters.map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-between'>
          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>Subject</label>
            <Select id='subject' required onChange={handleFilterChange} value={formData.subject} disabled={!formData.semester}>
              <option value=''>{!formData.semester ? 'Select Sem first' : 'Select Subject'}</option>
              {(formData.branch && formData.semester && curriculum[formData.branch][formData.semester]) && 
                curriculum[formData.branch][formData.semester].map(subj => (
                  <option key={subj.code} value={subj.code}>{subj.code} - {subj.name}</option>
                ))
              }
            </Select>
          </div>

          <div className='flex-1'>
            <label className='block text-sm font-medium mb-1'>Exam Type</label>
            <Select id='examType' required onChange={handleFilterChange} value={formData.examType} disabled={!formData.semester}>
              <option value=''>{!formData.semester ? 'Select Sem first' : 'Select Exam Type'}</option>
              <option value='sessional1'>Sessional 1</option>
              <option value='sessional2'>Sessional 2</option>
              <option value='final'>Final Exam</option>
            </Select>
          </div>
        </div>

        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput
            type='file'
            accept='application/pdf'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type='button'
            size='sm'
            outline
            onClick={handleUploadFile}
            disabled={fileUploadProgress !== null}
            className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white'
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
          <Alert color='success'>
            PDF uploaded successfully! URL: <a href={formData.fileUrl} target='_blank' rel='noreferrer' className='underline text-blue-500'>View PDF</a>
          </Alert>
        )}

        <Button type='submit' disabled={loading || !formData.fileUrl} className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white'>
          {loading ? 'Publishing...' : 'Publish Question Paper'}
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
