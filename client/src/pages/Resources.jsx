import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiDownload, HiEye } from 'react-icons/hi';
import { AiOutlineSearch } from 'react-icons/ai';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    category: '',
    searchTerm: '',
  });

  const fetchResources = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter.category) queryParams.append('category', filter.category);
      if (filter.searchTerm) queryParams.append('searchTerm', filter.searchTerm);

      const res = await fetch(`${BACKEND_URL}/api/resource/getresources?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources);
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleCategoryChange = (e) => {
    setFilter({ ...filter, category: e.target.value });
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-black p-4 sm:p-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-10'>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Learning Resources
          </h1>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Browse and download cheat sheets, notes, and study guides for your Computer Science journey.
          </p>
        </div>

        {/* Filters and Search */}
        <div className='bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm border border-gray-100 dark:border-gray-800'>
          <form onSubmit={handleSearchSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1 relative'>
              <TextInput
                type='text'
                placeholder='Search resources by title or keyword...'
                value={filter.searchTerm}
                onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
                icon={AiOutlineSearch}
              />
            </div>
            <div className='w-full sm:w-48'>
              <Select id='category' value={filter.category} onChange={handleCategoryChange}>
                <option value=''>All Categories</option>
                <option value='DSA'>DSA</option>
                <option value='Operating System'>Operating System</option>
                <option value='DBMS'>DBMS</option>
                <option value='Other'>Other</option>
              </Select>
            </div>
            <Button type='submit' gradientDuoTone='purpleToBlue'>
              Search
            </Button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className='text-center py-10'>
            <p className='text-gray-500 dark:text-gray-400'>Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className='text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800'>
            <p className='text-gray-500 dark:text-gray-400 text-lg'>No resources found.</p>
            <Button 
              className='mt-4 mx-auto' 
              outline 
              gradientDuoTone='purpleToBlue'
              onClick={() => setFilter({ category: '', searchTerm: '' })}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {resources.map((resource) => (
              <div 
                key={resource._id} 
                className='flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow'
              >
                <div className='p-6 flex-1'>
                  <div className='flex justify-between items-start mb-4'>
                    <span className='bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-teal-900 dark:text-teal-300'>
                      {resource.category}
                    </span>
                    <span className='text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded'>
                      {resource.resourceType || 'PDF'}
                    </span>
                  </div>
                  
                  <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2'>
                    {resource.title}
                  </h3>
                  
                  <p className='text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4'>
                    {resource.description}
                  </p>
                </div>
                
                <div className='p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 flex justify-between gap-3'>
                  <Button
                    color='gray'
                    className='flex-1'
                    onClick={() => window.open(resource.fileUrl, '_blank')}
                  >
                    <HiEye className='mr-2 h-5 w-5' />
                    View
                  </Button>
                  <Button
                    gradientDuoTone='purpleToBlue'
                    className='flex-1'
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = resource.fileUrl;
                      link.download = `${resource.title}.pdf`;
                      link.target = '_blank';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <HiDownload className='mr-2 h-5 w-5' />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
