import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { HiOutlineDocumentDownload, HiOutlineArrowLeft, HiOutlineArrowRight } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';

export default function TopicPage({ topic, subjectSlug, subjectName, previousTopic, nextTopic }) {
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?attachedResource=${topic._id}&limit=4`);
        if (res.ok) {
          const data = await res.json();
          setRelatedPosts(data.posts);
        }
      } catch (error) {
        console.error('Failed to fetch related posts', error);
      }
    };
    if (topic && topic._id) {
      fetchRelatedPosts();
    }
  }, [topic._id]);

  return (
    <article className='w-full max-w-4xl mx-auto'>
      {/* Breadcrumbs */}
      <nav className='flex text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium'>
        <Link to='/resources' className='hover:text-teal-600 dark:hover:text-teal-400 transition-colors'>
          Resources
        </Link>
        <span className='mx-2'>/</span>
        <Link to={`/resources/${subjectSlug}`} className='hover:text-teal-600 dark:hover:text-teal-400 transition-colors'>
          {subjectName}
        </Link>
        <span className='mx-2'>/</span>
        <span className='text-gray-900 dark:text-gray-200'>{topic.title}</span>
      </nav>

      {/* Topic Title */}
      <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight'>
        {topic.title}
      </h1>

      {/* Topic Content */}
      <div className='post-content text-gray-800 dark:text-gray-200 leading-relaxed text-lg'>
        {topic.content ? (
          <div dangerouslySetInnerHTML={{ __html: topic.content }} />
        ) : (
          <p className='text-gray-500 italic'>No detailed notes available for this topic yet.</p>
        )}
      </div>

      {/* Optional Downloadable Resource */}
      {topic.fileUrl && (
        <div className='mt-12 p-6 bg-gray-50 dark:bg-[#16181c] rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800'>
              <HiOutlineDocumentDownload className='w-8 h-8 text-teal-600 dark:text-teal-400' />
            </div>
            <div>
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>Download original resource</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>PDF Document attached to this topic</p>
            </div>
          </div>
          <div className='flex gap-3 w-full sm:w-auto'>
            <Button
              color='gray'
              className='flex-1 sm:flex-none'
              onClick={() => window.open(topic.fileUrl, '_blank')}
            >
              View PDF
            </Button>
            <Button
              className='flex-1 sm:flex-none bg-linear-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white! border-0'
              onClick={async () => {
                try {
                  const response = await fetch(topic.fileUrl);
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${topic.title.replace(/\s+/g, '_')}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Download failed', error);
                  window.open(topic.fileUrl, '_blank'); // fallback
                }
              }}
            >
              Download
            </Button>
          </div>
        </div>
      )}

      {/* Related ZBlogs */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className='mt-16 pt-8 border-t border-gray-200 dark:border-gray-800'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-6'>
            Related ZBlogs
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {relatedPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Previous / Next Navigation */}
      <div className='mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between gap-4'>
        {previousTopic ? (
          <Link 
            to={`/resources/${subjectSlug}/${previousTopic.slug}`}
            className='flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-teal-500 dark:hover:border-teal-500 transition-all group'
          >
            <div className='text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2'>
              <HiOutlineArrowLeft className='group-hover:-translate-x-1 transition-transform' />
              Previous Topic
            </div>
            <div className='font-semibold text-gray-900 dark:text-gray-100 truncate'>
              {previousTopic.title}
            </div>
          </Link>
        ) : (
          <div className='flex-1'></div>
        )}
        
        {nextTopic ? (
          <Link 
            to={`/resources/${subjectSlug}/${nextTopic.slug}`}
            className='flex-1 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-teal-500 dark:hover:border-teal-500 transition-all text-right group'
          >
            <div className='text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center justify-end gap-2'>
              Next Topic
              <HiOutlineArrowRight className='group-hover:translate-x-1 transition-transform' />
            </div>
            <div className='font-semibold text-gray-900 dark:text-gray-100 truncate'>
              {nextTopic.title}
            </div>
          </Link>
        ) : (
          <div className='flex-1'></div>
        )}
      </div>
    </article>
  );
}
