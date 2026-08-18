import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import ResourceCard from '../components/ResourceCard';

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
              </Select>
            </div>
            <Button type='submit' className='bg-linear-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white! border-0'>
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
              className='mt-4 mx-auto bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600'
              onClick={() => setFilter({ category: '', searchTerm: '' })}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
