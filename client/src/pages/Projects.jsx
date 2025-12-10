import CallToAction from '../components/CallToAction';

export default function Projects() {
  const learnings = [
    'How to structure HTML for clean and semantic code',
    'Styling with CSS to create visually appealing designs',
    'Adding interactivity with JavaScript',
    'Debugging and problem-solving techniques',
    'Best practices for responsive and accessible web design',
  ];

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='bg-gray-50 dark:bg-gray-900 py-16 md:py-24'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6'>
            Explore <span className='text-teal-600 dark:text-teal-500'>Projects</span>
          </h1>
          <p className='text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Dive into a collection of fun and engaging projects designed to help you
            learn and master HTML, CSS, and JavaScript.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className='max-w-4xl mx-auto px-6 py-16'>
        <div className='space-y-8'>
          {/* Why Build Projects */}
          <div className='p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-teal-500 dark:hover:border-teal-500 transition-colors'>
            <div className='flex items-start gap-4'>
              <span className='text-3xl font-bold text-teal-500'>01</span>
              <div>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3'>
                  Why Build Projects?
                </h2>
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                  Building projects is one of the best ways to learn programming. It
                  allows you to apply theoretical knowledge in a practical way, solve
                  real-world problems, and create a portfolio that showcases your
                  skills to potential employers or clients.
                </p>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className='p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-teal-500 dark:hover:border-teal-500 transition-colors'>
            <div className='flex items-start gap-4'>
              <span className='text-3xl font-bold text-teal-500'>02</span>
              <div className='flex-1'>
                <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
                  What You'll Learn
                </h2>
                <ul className='space-y-3'>
                  {learnings.map((item, index) => (
                    <li key={index} className='flex items-start gap-3 text-gray-600 dark:text-gray-400'>
                      <span className='text-teal-500 mt-1'>→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Get Started */}
          <div className='p-8 rounded-2xl bg-gray-900 dark:bg-black border border-gray-800'>
            <div className='flex items-start gap-4'>
              <span className='text-3xl font-bold text-teal-500'>03</span>
              <div>
                <h2 className='text-2xl font-semibold text-white mb-3'>
                  Ready to Start Building?
                </h2>
                <p className='text-gray-400 leading-relaxed mb-6'>
                  Whether you're a beginner or an experienced developer, these projects will challenge
                  your skills and inspire creativity. Start building today and take your development
                  journey to the next level!
                </p>
                <a
                  href='/coming-soon'
                  className='inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors'
                >
                  Browse Projects
                  <span>→</span>
                </a>
              </div>
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
