import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${BACKEND_URL}/api/post/getposts?slug=${postSlug}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(
          `${BACKEND_URL}/api/post/getposts?limit=3`
        );
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  if (error || !post) {
    return (
      <div className='flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300'>
        Failed to load post.
      </div>
    );
  }

  return (
    <main className='px-4 sm:px-6 lg:px-8 py-6 flex flex-col max-w-7xl mx-auto min-h-screen'>
      <article className='w-full max-w-5xl mx-auto'>
        <h1 className='text-3xl sm:text-4xl lg:text-5xl mt-4 text-center font-serif leading-tight text-gray-900 dark:text-white'>
          {post && post.title}
        </h1>

        <div className='mt-4 flex justify-center'>
          <Link to={`/search?category=${post && post.category}`}>
            <Button color='gray' pill size='xs'>
              {post && post.category}
            </Button>
          </Link>
        </div>

        <img
          src={post && post.image}
          alt={post && post.title}
          className='mt-6 w-full h-[56vh] min-h-80 max-h-[720px] object-cover rounded-2xl border border-gray-200 dark:border-gray-700'
        />

        <div className='mt-4 flex justify-between border-b border-slate-400 dark:border-slate-600 pb-3 w-full text-sm'>
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className='italic'>
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>

        <div
          className='pt-6 w-full post-content text-gray-800 dark:text-gray-100'
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>

        <p className='pt-4 pb-3 text-sm text-gray-600 dark:text-gray-400'>
          This post is part of my ongoing software engineering learning log. Explore
          more notes on data structures, C++, web development, and systems in the{' '}
          <Link to='/search' className='text-teal-600 dark:text-teal-400 hover:underline'>
            blog index
          </Link>
          .
        </p>
      </article>

      {post && (
        <div className='w-full max-w-5xl mx-auto mt-4'>
          <CommentSection postId={post._id} />
        </div>
      )}

      <div className='w-full max-w-5xl mx-auto mt-8 mb-6'>
        <h2 className='text-2xl font-semibold text-center text-gray-900 dark:text-white'>
          Recent articles
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5'>
          {recentPosts &&
            recentPosts
              .filter((recentPost) => recentPost._id !== post?._id)
              .map((recentPost) => <PostCard key={recentPost._id} post={recentPost} />)}
        </div>
      </div>
    </main>
  );
}