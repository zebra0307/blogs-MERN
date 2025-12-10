import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='group relative w-full border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 h-[340px] overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[200px] w-full object-cover group-hover:h-[160px] transition-all duration-300'
        />
      </Link>
      <div className='p-3 flex flex-col gap-1'>
        <p className='text-base font-semibold line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors'>{post.title}</p>
        <span className='text-xs text-gray-500 dark:text-gray-400 italic'>{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 transition-all duration-300 text-center py-2 m-2 rounded-lg'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
