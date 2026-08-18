import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function About() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='min-h-screen'>
      {/* Content Section */}
      <div className='max-w-4xl mx-auto px-6 py-16'>
        <div className='space-y-12'>
          {/* Welcome Section */}
          <div className='grid md:grid-cols-3 gap-8 items-start'>
            <div className='md:col-span-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Welcome to Z-Blogs
              </h2>
              <div className='w-12 h-1 bg-teal-500 mt-2'></div>
            </div>
            <div className='md:col-span-2'>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                Z-Blogs is a vibrant public community designed for students, developers, and lifelong learners. 
                Our platform provides a space to interact, read high-quality technical blogs, and access community resources.
              </p>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed mt-4'>
                If you are seeking insightful articles on data structures, algorithms, and web development, you are in the right place!
              </p>
            </div>
          </div>

          {/* How to Contribute */}
          <div className='grid md:grid-cols-3 gap-8 items-start'>
            <div className='md:col-span-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                How You Can Contribute
              </h2>
              <div className='w-12 h-1 bg-teal-500 mt-2'></div>
            </div>
            <div className='md:col-span-2'>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                This platform thrives on community participation! Every registered member is encouraged to contribute their knowledge and engage with others.
              </p>
              <ul className='space-y-3 text-gray-600 dark:text-gray-400 mt-4 list-disc pl-5'>
                <li><strong>Write Blog Posts:</strong> You can publish your own technical articles, tutorials, or study notes. To ensure quality, members can submit <strong>one blog post per month</strong>. All submissions are reviewed by our admins before going live.</li>
                <li><strong>Engage in Comments:</strong> Discuss topics, ask questions, and help out your peers in the comment sections of blog posts.</li>
                <li><strong>Stay Anonymous:</strong> Your privacy is fully protected. When you comment or post, only your unique username and profile picture are visible to the public. Your personal details are completely hidden.</li>
              </ul>
            </div>
          </div>

          {/* Resources */}
          <div className='grid md:grid-cols-3 gap-8 items-start'>
            <div className='md:col-span-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Learning Resources
              </h2>
              <div className='w-12 h-1 bg-teal-500 mt-2'></div>
            </div>
            <div className='md:col-span-2'>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                Our dedicated <strong>Resources</strong> section is continuously updated with cheat sheets, study notes, 
                and guides across various CS concepts like Data Structures, Operating Systems, and DBMS.
              </p>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed mt-4'>
                All resources are neatly categorized and can be instantly viewed or downloaded in PDF format.
              </p>
            </div>
          </div>

        </div>

        {/* Next Steps */}
        <div className='mt-16 p-8 border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3'>
            Where to Go Next
          </h2>
          <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
            Dive right in! Read the latest articles from the community, or head over to the Resources portal to gear up for your studies.
          </p>
          <div className='flex flex-wrap items-center gap-6 mt-5'>
            <Link
              to='/search'
              className='text-teal-600 dark:text-teal-400 font-semibold hover:underline'
            >
              Read Community Posts →
            </Link>
            <Link
              to='/resources'
              className='text-teal-600 dark:text-teal-400 font-semibold hover:underline'
            >
              Access Learning Resources →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
