import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className='min-h-screen'>
      {/* Content Section */}
      <div className='max-w-4xl mx-auto px-6 py-16'>
        <div className='space-y-12'>
          {/* Who I Am */}
          <div className='grid md:grid-cols-3 gap-8 items-start'>
            <div className='md:col-span-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Who I Am
              </h2>
              <div className='w-12 h-1 bg-teal-500 mt-2'></div>
            </div>
            <div className='md:col-span-2'>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                I am Satyendra Yadav, a developer focused on becoming a stronger software engineer through consistent
                practice, implementation, and reflection.
              </p>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed mt-4'>
                This site is my technical blog plus portfolio. It is where I document what I learn, what I build,
                and how my engineering approach is improving over time.
              </p>
            </div>
          </div>

          {/* What I Write About */}
          <div className='grid md:grid-cols-3 gap-8 items-start'>
            <div className='md:col-span-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                What I Write About
              </h2>
              <div className='w-12 h-1 bg-teal-500 mt-2'></div>
            </div>
            <div className='md:col-span-2'>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                I publish weekly technical notes on data structures and algorithms, C++, web development,
                and systems concepts.
              </p>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed mt-4'>
                My posts are practical learning notes, not generic summaries. I focus on what I implemented,
                what failed, what changed, and what I learned.
              </p>
            </div>
          </div>

          {/* How I Build */}
          <div className='grid md:grid-cols-3 gap-8 items-start'>
            <div className='md:col-span-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                How I Build and Practice
              </h2>
              <div className='w-12 h-1 bg-teal-500 mt-2'></div>
            </div>
            <div className='md:col-span-2'>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                I use projects to apply concepts in real scenarios. Building helps me move from understanding
                theory to making reliable implementation decisions.
              </p>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed mt-4'>
                The blog and projects support each other: project work creates writing topics, and writing helps me
                reflect and improve the next iteration.
              </p>
            </div>
          </div>

          {/* Current Focus */}
          <div className='grid md:grid-cols-3 gap-8 items-start'>
            <div className='md:col-span-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Current Focus
              </h2>
              <div className='w-12 h-1 bg-teal-500 mt-2'></div>
            </div>
            <div className='md:col-span-2'>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                Right now I am focused on improving DSA problem solving, writing stronger C++, and building
                cleaner frontend and full-stack applications.
              </p>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed mt-4'>
                I am also developing better engineering habits around debugging, code organization,
                and practical system-level thinking.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className='grid md:grid-cols-3 gap-8 items-start'>
            <div className='md:col-span-1'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Tech I Work With
              </h2>
              <div className='w-12 h-1 bg-teal-500 mt-2'></div>
            </div>
            <div className='md:col-span-2'>
              <ul className='space-y-3 text-gray-600 dark:text-gray-400'>
                <li>Languages: C++, JavaScript, TypeScript</li>
                <li>Web: React, Next.js, Node.js</li>
                <li>Core Focus: Data Structures, Algorithms, and Systems Concepts</li>
                <li>Tools: Git, GitHub, VS Code</li>
                <li>Deployment: Vercel, Render</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className='mt-16 p-8 border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900'>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-3'>
            Where to Go Next
          </h2>
          <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
            If you want to see how I think and build, start with my latest technical posts,
            then explore projects where those ideas are applied in code.
          </p>
          <div className='flex flex-wrap items-center gap-6 mt-5'>
            <Link
              to='/search'
              className='text-teal-600 dark:text-teal-400 font-semibold hover:underline'
            >
              Read my latest technical posts →
            </Link>
            <Link
              to='/projects'
              className='text-teal-600 dark:text-teal-400 font-semibold hover:underline'
            >
              Explore my projects →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
