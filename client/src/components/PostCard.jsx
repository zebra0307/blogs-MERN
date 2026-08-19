import { Link } from 'react-router-dom';
import { POST_CATEGORIES } from '../utils/categories';

export default function PostCard({ post }) {
  const categoryLabel = POST_CATEGORIES.find(c => c.value === post.category)?.label || post.category;
  return (
    <Link 
      to={`/post/${post.slug}`} 
      className='block w-full border border-gray-300 dark:border-gray-700 h-[340px] overflow-hidden rounded-xl bg-white dark:bg-gray-800 cursor-pointer'
    >
      <img
        src={post.image}
        alt='post cover'
        className='h-[200px] w-full object-cover'
      />
      <div className='p-3 flex flex-col gap-1'>
        <p className='text-base font-semibold tracking-tight line-clamp-2 text-gray-900 dark:text-white'>
          {post.title}
        </p>
        <span className='text-xs text-gray-500 dark:text-gray-400 italic font-light'>
          {categoryLabel}
        </span>
      </div>
    </Link>
  );
}
