import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import PostCard from '../components/PostCard';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

function CategorySection({ title, categoryUrl, fetchUrl, bgClass = 'bg-white dark:bg-[#09090b]' }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(fetchUrl);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
        }
      } catch (error) {
        console.error(`Failed to fetch ${title} data`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [fetchUrl]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1); // -1px tolerance
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [posts]);

  const scrollLeftClick = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRightClick = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!loading && (!posts || posts.length === 0)) return null;

  return (
    <section className={`w-full py-10 border-t border-gray-200 dark:border-gray-800 ${bgClass}`}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {title}
          </h2>
          <Link to={categoryUrl} className='text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 group'>
            See all <span className='group-hover:translate-x-1 transition-transform'>&rarr;</span>
          </Link>
        </div>
        
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='w-full h-[340px] bg-gray-200 dark:bg-gray-800 rounded-xl'></div>
            ))}
          </div>
        ) : (
          <div className='relative group/carousel -mx-4'>
            {/* Left Navigation Arrow */}
            {posts.length > 4 && (
              <button 
                onClick={scrollLeftClick}
                disabled={!canScrollLeft}
                aria-label="Previous articles"
                className={`hidden sm:flex absolute left-0 lg:-left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-md transition-opacity duration-300 ${canScrollLeft ? 'opacity-100 hover:text-teal-500 dark:hover:text-teal-400 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
              >
                <BsChevronLeft size={20} className='mr-1' />
              </button>
            )}

            {/* Carousel Track */}
            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className='flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4'
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {posts.map((post) => (
                <div key={post._id} className='w-full sm:w-1/2 lg:w-1/4 flex-none snap-start px-4'>
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {/* Right Navigation Arrow */}
            {posts.length > 4 && (
              <button 
                onClick={scrollRightClick}
                disabled={!canScrollRight}
                aria-label="Next articles"
                className={`hidden sm:flex absolute right-0 lg:-right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 shadow-md transition-opacity duration-300 ${canScrollRight ? 'opacity-100 hover:text-teal-500 dark:hover:text-teal-400 cursor-pointer' : 'opacity-0 pointer-events-none'}`}
              >
                <BsChevronRight size={20} className='ml-1' />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className='min-h-screen bg-white dark:bg-black font-sans'>
      
      {/* Compact Branded Hero */}
      <section className='relative w-full overflow-hidden bg-[#09090b] text-white py-8 sm:py-12'>
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute -top-24 -right-24 w-96 h-96 bg-teal-500 rounded-full mix-blend-screen filter blur-[100px]'></div>
        </div>
        
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8'>
          <div className='flex-1'>
            <h1 className='text-2xl sm:text-4xl font-bold font-serif tracking-tight text-teal-400 mb-2'>
              Learn. Build. Understand.
            </h1>
            <p className='text-base sm:text-lg text-gray-400 max-w-2xl font-light leading-relaxed'>
              Technical articles on computer science, data structures, systems, and problem solving. 
            </p>
          </div>
          
          <div className='hidden md:block w-32 h-32 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 shrink-0 bg-white'>
            <img src='/zebra-hero.jpg' alt='Zebra Branding' className='w-full h-full object-cover scale-x-[-1]' />
          </div>
        </div>
      </section>

      {/* Article Sections (Independent Fetching) */}
      <CategorySection 
        title="Recent Articles" 
        categoryUrl="/search" 
        fetchUrl={`${BACKEND_URL}/api/post/getposts?limit=8`}
        bgClass="bg-white dark:bg-[#09090b]" 
      />
      
      <CategorySection 
        title="Data Structures & Algorithms" 
        categoryUrl="/search?category=data-structures-algorithms" 
        fetchUrl={`${BACKEND_URL}/api/post/getposts?category=data-structures-algorithms&limit=8`}
        bgClass="bg-gray-50 dark:bg-[#121212]" 
      />
      
      <CategorySection 
        title="Database Management System" 
        categoryUrl="/search?category=database-management-system" 
        fetchUrl={`${BACKEND_URL}/api/post/getposts?category=database-management-system&limit=8`}
        bgClass="bg-white dark:bg-[#09090b]" 
      />
      
      <CategorySection 
        title="Operating Systems" 
        categoryUrl="/search?category=operating-system" 
        fetchUrl={`${BACKEND_URL}/api/post/getposts?category=operating-system&limit=8`}
        bgClass="bg-gray-50 dark:bg-[#121212]" 
      />
      
      <CategorySection 
        title="System Design" 
        categoryUrl="/search?category=system-design" 
        fetchUrl={`${BACKEND_URL}/api/post/getposts?category=system-design&limit=8`}
        bgClass="bg-white dark:bg-[#09090b]" 
      />

    </div>
  );
}
