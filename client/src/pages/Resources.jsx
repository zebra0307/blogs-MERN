import { Link } from 'react-router-dom';
import { FaCode, FaLaptopCode, FaCubes } from 'react-icons/fa';

export default function Resources() {
  const folders = [
    {
      name: 'Data Structure',
      icon: <FaCode className='text-4xl text-teal-500 mb-4' />,
      path: '/coming-soon',
      description: 'Algorithms, data structures, and problem-solving notes.',
    },
    {
      name: 'Web Development',
      icon: <FaLaptopCode className='text-4xl text-teal-500 mb-4' />,
      path: '/coming-soon',
      description: 'React, Node.js, and modern full-stack web development.',
    },
    {
      name: 'Blockchain',
      icon: <FaCubes className='text-4xl text-teal-500 mb-4' />,
      path: '/coming-soon',
      description: 'Web3, smart contracts, and decentralized applications.',
    },
  ];

  return (
    <div className='min-h-screen max-w-6xl mx-auto px-4 py-16'>
      <div className='text-center mb-16'>
        <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
          Learning Resources
        </h1>
        <p className='text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto'>
          Explore curated notes, tutorials, and deep dives across these main topics. 
          More resources will be added to these folders soon!
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {folders.map((folder, idx) => (
          <Link
            key={idx}
            to={folder.path}
            className='group flex flex-col items-center text-center p-8 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-teal-900/20 transition-all hover:-translate-y-1'
          >
            {folder.icon}
            <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-teal-500 transition-colors'>
              {folder.name}
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              {folder.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
