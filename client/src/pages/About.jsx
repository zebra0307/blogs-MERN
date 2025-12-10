import CallToAction from '../components/CallToAction';

export default function About() {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='bg-gray-50 dark:bg-gray-900 py-16 md:py-24'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
            About <span className='text-teal-600 dark:text-teal-500'>Z Blogs</span>
          </h1>
          <p className='text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            A platform dedicated to sharing knowledge and helping developers grow their skills through quality content.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className='max-w-4xl mx-auto px-6 py-16'>
        <div className='space-y-12'>
          {/* Story */}
          <div className='grid md:grid-cols-3 gap-8 items-start'>
            <div className='md:col-span-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Our Story
              </h2>
              <div className='w-12 h-1 bg-teal-500 mt-2'></div>
            </div>
            <div className='md:col-span-2'>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                Z Blogs was created by Satyendra Yadav as a personal project to share thoughts and ideas with the
                world. With a passion for technology, coding, and everything in between, this platform has grown
                into a resource for developers at all levels.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className='grid md:grid-cols-3 gap-8 items-start'>
            <div className='md:col-span-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Our Mission
              </h2>
              <div className='w-12 h-1 bg-teal-500 mt-2'></div>
            </div>
            <div className='md:col-span-2'>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                On this blog, you'll find weekly articles and tutorials on topics such as web development, DSA,
                software engineering, and programming languages. We are always learning and exploring new
                technologies, so be sure to check back often for new content!
              </p>
            </div>
          </div>

          {/* Community */}
          <div className='grid md:grid-cols-3 gap-8 items-start'>
            <div className='md:col-span-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Community
              </h2>
              <div className='w-12 h-1 bg-teal-500 mt-2'></div>
            </div>
            <div className='md:col-span-2'>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                We encourage you to leave comments on our posts and engage with other readers. You can like
                other people's comments and reply to them as well. We believe that a community of learners
                can help each other grow and improve.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className='mt-16 py-8 border-t border-b border-gray-200 dark:border-gray-800'>
          <div className='grid grid-cols-3 gap-8 text-center'>
            <div>
              <div className='text-3xl font-bold text-teal-600 dark:text-teal-500'>20+</div>
              <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Articles</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-teal-600 dark:text-teal-500'>30+</div>
              <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Categories</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-teal-600 dark:text-teal-500'>300+</div>
              <div className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Readers</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className='mt-16 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700'>
          <CallToAction />
        </div>
      </div>
    </div>
  );
}
