import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import ResourceCard from '../components/ResourceCard';
import NewsletterSubscribe from '../components/NewsletterSubscribe';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [author, setAuthor] = useState(null);

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
          
          // Fetch author
          try {
            const userRes = await fetch(`${BACKEND_URL}/api/user/${data.posts[0].userId}`);
            if (userRes.ok) {
              const userData = await userRes.json();
              setAuthor(userData);
            }
          } catch (err) {
            console.log(err.message);
          }
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
          `${BACKEND_URL}/api/post/getposts?limit=5`
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

  const renderContent = () => {
    if (!post || !post.content) return null;
    
    // Match the shortcode, optionally surrounded by <p> tags from ReactQuill
    const parts = post.content.split(/(?:<p>)?\s*\[RESOURCE_EMBED:([a-fA-F0-9]{24})\]\s*(?:<\/p>)?/);
    
    return parts.map((part, index) => {
      // If the part is exactly 24 hex characters, it's our matched ID
      if (part.length === 24 && /^[a-fA-F0-9]{24}$/.test(part)) {
        const resource = post.attachedResources?.find(r => r._id === part);
        if (resource) {
          return (
            <div key={index} className="my-8 w-full max-w-2xl mx-auto">
              <ResourceCard resource={resource} />
            </div>
          );
        } else {
          return <span key={index} className="italic text-gray-500 bg-gray-100 px-2 py-1 rounded text-sm">[Attached Resource Unavailable]</span>;
        }
      }
      
      // Render standard HTML parts
      if (part.trim()) {
        let htmlContent = part;
        
        const categoryToSlug = {
          'DSA': 'dsa',
          'Operating System': 'operating-system',
          'DBMS': 'dbms',
          'System Design': 'system-design'
        };

        // Replace inline resource links
        htmlContent = htmlContent.replace(/\[RESOURCE_LINK:([a-fA-F0-9]{24})\|([^\]]+)\]/g, (match, id, text) => {
          const resource = post.attachedResources?.find(r => r._id === id);
          if (resource) {
            const subjectSlug = categoryToSlug[resource.category] || 'dsa';
            return `<a href="/resources/${subjectSlug}/${resource.slug}" class="text-teal-600 dark:text-teal-400 hover:underline font-medium transition-colors cursor-pointer" title="${resource.title}">${text}</a>`;
          } else {
            return `<span class="italic text-gray-500 bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm">[Unavailable: ${text}]</span>`;
          }
        });

        return (
          <div
            key={index}
            className='w-full post-content text-gray-800 dark:text-gray-100'
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );
      }
      return null;
    });
  };

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
          <div className='flex items-center gap-2'>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            {author && (
              <>
                <span className='text-gray-400'>•</span>
                <span className='font-medium italic text-gray-700 dark:text-gray-300'>By {author.username}</span>
              </>
            )}
          </div>
          <span className='italic'>
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>

        <div className='pt-6 w-full flex flex-col'>
          {renderContent()}
        </div>

        <p className='pt-4 pb-3 text-sm text-gray-600 dark:text-gray-400'>
          This post is part of my ongoing software engineering learning log. Explore
          more notes on data structures, C++, web development, and systems in the{' '}
          <Link to='/search' className='text-teal-600 dark:text-teal-400 hover:underline'>
            blog index
          </Link>
          .
        </p>

        {post && (
          <div className='w-full mt-10 mb-6 border-t border-gray-200 dark:border-gray-800 pt-8'>
            <CommentSection postId={post._id} />
          </div>
        )}

        <div className='my-12'>
          <NewsletterSubscribe />
        </div>
      </article>

      <div className='w-full max-w-5xl mx-auto mt-8 mb-6'>
        <h2 className='text-2xl font-semibold text-center text-gray-900 dark:text-white'>
          Recent articles
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
          {recentPosts &&
            recentPosts
              .filter((recentPost) => recentPost._id !== post?._id)
              .slice(0, 4)
              .map((recentPost) => <PostCard key={recentPost._id} post={recentPost} />)}
        </div>
      </div>
    </main>
  );
}