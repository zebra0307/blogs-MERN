import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { POST_CATEGORIES } from '../utils/categories';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function Search() {
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState(() => {
    const urlParams = new URLSearchParams(location.search);
    return {
      searchTerm: urlParams.get('searchTerm') || '',
      sort: urlParams.get('sort') || 'desc',
      category: urlParams.get('category') || 'uncategorized',
    };
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `${BACKEND_URL}/api/post/getposts?${searchQuery}`
      );
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized';
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(
      `${BACKEND_URL}/api/post/getposts?${searchQuery}`
    );
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className='flex flex-col md:flex-row'>
      {/* Filter Sidebar - Thin & Compact */}
      <div className='p-4 border-b md:border-r md:min-h-screen border-gray-200 dark:border-gray-700 md:w-56 shrink-0 bg-gray-50 dark:bg-gray-900/50'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          {/* Search Term */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide'>
              Search
            </label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              sizing='sm'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          {/* Sort */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide'>Sort</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort' sizing='sm'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          {/* Category */}
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide'>Category</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id='category'
            >
              <option value='uncategorized'>All Categories</option>
              {POST_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Select>
          </div>
          <Button type='submit' size='sm' className='bg-linear-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white w-full'>
            Apply
          </Button>
        </form>
      </div>

      {/* Main Content Area - Blog Grid */}
      <div className='flex-1 min-w-0'>
        <h1 className='text-2xl font-semibold border-b border-gray-200 dark:border-gray-700 px-4 py-3'>
          Weekly Technical Notes
        </h1>
        <div className='p-4'>
          <p className='text-sm md:text-base text-gray-600 dark:text-gray-400 mb-5'>
            I publish regular learning notes on data structures, C++, web development,
            systems, and implementation decisions from ongoing projects.
          </p>
          {!loading && posts.length === 0 && (
            <p className='text-lg text-gray-500 text-center py-8'>No matching notes found.</p>
          )}
          {loading && <p className='text-lg text-gray-500 text-center py-8'>Loading...</p>}
          {/* 3-Column Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
            {!loading &&
              posts &&
              posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-sm font-medium hover:underline py-6 w-full text-center'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}