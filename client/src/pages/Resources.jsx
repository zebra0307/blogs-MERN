import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';

export default function Resources() {
  const subjects = [
    {
      id: '01',
      title: 'Data Structures & Algorithms',
      description: 'Core concepts and problem solving',
      slug: 'dsa',
      topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs', 'Dynamic Programming']
    },
    {
      id: '02',
      title: 'Database Management System',
      description: 'Database concepts, SQL and transactions',
      slug: 'dbms',
      topics: ['SQL', 'Joins', 'Indexing', 'Normalization', 'Transactions', 'Concurrency']
    },
    {
      id: '03',
      title: 'Operating System',
      description: 'Core OS concepts and notes',
      slug: 'operating-system',
      topics: ['Processes', 'Scheduling', 'Memory', 'Deadlocks', 'Paging', 'Concurrency']
    },
    {
      id: '04',
      title: 'System Design',
      description: 'Architecture, scalability, and system components',
      slug: 'system-design',
      topics: ['Microservices', 'Load Balancing', 'Caching', 'Message Queues', 'Databases', 'API Design']
    }
  ];

  return (
    <div className='min-h-screen bg-white dark:bg-[#000000] p-4 sm:p-8 font-sans'>
      <div className='max-w-5xl mx-auto mt-4 md:mt-8'>
        
        {/* Hero Section */}
        <div className='mb-8 md:mb-12 text-left border-b border-gray-200 dark:border-gray-800 pb-6'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 font-serif tracking-tight'>
            Computer Science Resources
          </h1>
        </div>

        {/* Subjects List */}
        <div className='flex flex-col'>
          {subjects.map((subject) => (
            <Link 
              key={subject.slug} 
              to={`/resources/${subject.slug}`}
              className='group flex flex-col md:flex-row md:items-start border-b border-gray-200 dark:border-gray-800 py-8 hover:bg-gray-50 dark:hover:bg-[#080808] transition-colors -mx-4 px-4 sm:-mx-8 sm:px-8'
            >
              {/* Sequence Number */}
              <div className='w-12 shrink-0 text-sm font-mono text-gray-400 dark:text-gray-600 mb-2 md:mb-0 md:pt-1'>
                {subject.id}
              </div>

              {/* Title & Description */}
              <div className='w-full md:w-1/3 pr-6 mb-4 md:mb-0'>
                <h2 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight'>
                  {subject.title}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed'>
                  {subject.description}
                </p>
              </div>

              {/* Representative Topics */}
              <div className='w-full md:w-5/12 pr-6 mb-6 md:mb-0'>
                <div className='text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed md:pt-1'>
                  {subject.topics.join(' · ')}
                </div>
              </div>

              {/* Explore Action */}
              <div className='w-full md:w-2/12 flex md:justify-end items-center md:pt-1 text-teal-600 dark:text-teal-500 font-medium text-sm'>
                <span className='mr-2 group-hover:underline'>Explore resources</span>
                <HiOutlineArrowRight className='transition-transform group-hover:translate-x-1' />
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </div>
  );
}
