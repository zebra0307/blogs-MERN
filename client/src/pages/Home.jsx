import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import HomeSlides from '../components/HomeSlides';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

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

  return (
    <div>
      {/* Welcome Section */}
      <div className='flex flex-col gap-6 p-10 px-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl pt-10 text-gray-900 dark:text-white'>
          Welcome to <span className='text-teal-600 dark:text-teal-500'>Z Blogs</span>
        </h1>
        <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed'>
          Welcome to Z Blogs! Here you'll find a wide range of articles,
          tutorials, and resources designed to help you grow as a developer.
          Whether you're interested in web development, software engineering,
          programming languages, or best practices in the tech industry, there's
          something here for everyone. Dive in and explore the content to expand
          your knowledge and skills.
        </p>
        <Link
          to='/search'
          className='text-sm sm:text-base text-teal-600 dark:text-teal-400 font-semibold hover:underline'
        >
          View all posts →
        </Link>
        <div className='p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700'>
          <CallToAction />
        </div>
      </div>

      {/* Homepage Slides: About Us, How to Use, FAQs, Resources */}
      <HomeSlides />

      {/* Recent Posts Section */}
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-16'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center text-gray-900 dark:text-white'>
              Recent Posts
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-base text-teal-600 dark:text-teal-400 hover:underline text-center font-medium'
            >
              View all posts →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

