import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import HomeSlides from '../components/HomeSlides';
import DotGrid from '../components/DotGrid';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/post/getposts`
        );
        const data = await res.json();
        console.log('Fetched posts:', data);
        if (res.ok && data.posts) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0))
    .slice(0, 3);

  return (
    <div>
      {/* Welcome Section */}
      <div className='relative overflow-hidden border-b border-slate-800 bg-slate-950'>
        <DotGrid
          className='z-0 opacity-80'
          dotSize={10}
          gap={24}
          baseColor='#155e75'
          activeColor='#5eead4'
          proximity={130}
          speedTrigger={140}
          shockRadius={200}
          shockStrength={3}
          returnDuration={1.1}
        />
        <div className='absolute inset-0 z-10 bg-linear-to-b from-slate-950/75 via-slate-950/60 to-slate-950/82' />

        <div className='relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20'>
          <p className='inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-teal-200 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-300/25'>
            Weekly Engineering Journal
          </p>

          <h1 className='mt-6 max-w-4xl text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight text-white'>
            Building as a Software Developer and sharing practical notes every week on{' '}
            <span className='text-teal-300'>Z Blogs</span>
          </h1>

          <p className='mt-6 max-w-3xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-200'>
            I document what I build, what breaks, and what I learn while
            improving in data structures, C++, web development, and systems
            thinking.
          </p>

          <div className='mt-8 flex flex-wrap items-center gap-3 sm:gap-4'>
            <Link
              to='/search'
              className='inline-flex items-center justify-center rounded-lg bg-teal-600 hover:bg-teal-700 text-white! text-sm sm:text-base font-semibold px-5 py-2.5 transition-colors shadow-sm'
            >
              Read the blog
            </Link>
            <Link
              to='/projects'
              className='inline-flex items-center justify-center rounded-lg border border-teal-200/70 bg-slate-900/75 text-teal-100! hover:bg-slate-800 hover:border-teal-100 text-sm sm:text-base font-semibold px-5 py-2.5 transition-colors shadow-sm'
            >
              View projects
            </Link>
          </div>

          <div className='mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl'>
            <div className='rounded-lg border border-slate-700 bg-slate-900/55 backdrop-blur-sm px-4 py-3'>
              <p className='text-xs uppercase tracking-wide text-slate-400'>
                Focus
              </p>
              <p className='text-sm font-semibold text-white'>
                DSA • C++ • Full-Stack
              </p>
            </div>
            <div className='rounded-lg border border-slate-700 bg-slate-900/55 backdrop-blur-sm px-4 py-3'>
              <p className='text-xs uppercase tracking-wide text-slate-400'>
                Publishing
              </p>
              <p className='text-sm font-semibold text-white'>
                Weekly technical notes
              </p>
            </div>
            <div className='rounded-lg border border-slate-700 bg-slate-900/55 backdrop-blur-sm px-4 py-3'>
              <p className='text-xs uppercase tracking-wide text-slate-400'>
                Build style
              </p>
              <p className='text-sm font-semibold text-white'>
                Product-minded iteration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Homepage Slides: About Us, How to Use, FAQs */}
      <HomeSlides />

      {/* Recent Posts Section */}
      <div className='w-full bg-gray-900 dark:bg-black border-t border-gray-700 dark:border-gray-800'>
        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-16'>
          {latestPosts.length > 0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl font-semibold text-center text-white'>
                Latest Weekly Notes
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {latestPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link
                to={'/search'}
                className='text-base text-teal-300 hover:text-teal-200 hover:underline text-center font-medium'
              >
                View all posts →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

