import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { POST_CATEGORIES } from '../utils/categories';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

// Generic descriptions mapping for "What You'll Find Here"
const categoryDescriptions = {
  'data-structures-algorithms': 'Problem solving, data structures, algorithms, competitive programming, complexity analysis, and related concepts.',
  'database-management-system': 'SQL, relational models, normalization, indexing, transactions, concurrency, and database internals.',
  'operating-system': 'Processes, threads, CPU scheduling, memory management, synchronization, deadlocks, and related concepts.',
  'system-design': 'Scalability, databases, caching, APIs, distributed systems, architecture, and real-world design concepts.',
};

const getCategoryDescription = (categoryId) => {
  if (categoryDescriptions[categoryId]) {
    return categoryDescriptions[categoryId];
  }
  return `Explore technical articles, problem-solving techniques, and deep dives into ${categoryId.split('-').join(' ')}.`;
};

const getCategoryLabel = (categoryId) => {
  const cat = POST_CATEGORIES.find(c => c.value === categoryId);
  if (cat) return cat.label;
  return categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function About() {
  const [categoryStats, setCategoryStats] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/post/category-stats`);
        if (res.ok) {
          const data = await res.json();
          const legacyMap = {
            'dsa': 'data-structures-algorithms',
            'dbms': 'database-management-system',
            'os': 'operating-system',
            'sd': 'system-design',
            'uncategorised': 'uncategorized'
          };

          const mergedStats = {};
          data.forEach(stat => {
            // Skip uncategorized completely if we want to hide it
            if (stat.category === 'uncategorized' || stat.category === 'uncategorised') return;
            
            const cat = legacyMap[stat.category] || stat.category;
            mergedStats[cat] = (mergedStats[cat] || 0) + stat.count;
          });

          const validCategoryValues = POST_CATEGORIES.map(c => c.value);

          const formattedStats = Object.keys(mergedStats)
            .filter(key => validCategoryValues.includes(key))
            .map(key => ({
              category: key,
              count: mergedStats[key]
            }))
            .sort((a, b) => b.count - a.count);

          setCategoryStats(formattedStats);
          const total = formattedStats.reduce((acc, curr) => acc + curr.count, 0);
          setTotalPosts(total);
        }
      } catch (error) {
        console.error('Failed to fetch category stats', error);
      }
    };
    fetchStats();
  }, []);

  const maxCount = categoryStats.length > 0 ? Math.max(...categoryStats.map(c => c.count)) : 1;

  return (
    <div className='min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans'>
      
      {/* 1. About Page Hero */}
      <section className='max-w-4xl mx-auto px-6 pt-24 pb-16 text-center'>
        <h1 className='text-4xl md:text-5xl font-bold font-serif tracking-tight text-gray-900 dark:text-white mb-6'>
          About Z Blogs
        </h1>
        <p className='text-xl md:text-2xl text-teal-600 dark:text-teal-400 font-medium mb-6'>
          Learn. Understand. Build. Share.
        </p>
        <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed'>
          Z Blogs is a learning platform where I document what I'm learning about computer science, one concept at a time. The platform focuses on making difficult technical concepts easier to understand through articles, examples, diagrams, problem solving, and practical explanations.
        </p>
      </section>

      {/* 2. Why Z Blogs? */}
      <section className='bg-gray-50 dark:bg-[#121212] py-20 border-y border-gray-200 dark:border-gray-800'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-4'>Why Z Blogs?</h2>
            <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed'>
              Built from a learner's perspective, the goal is not simply to publish definitions, but to truly understand.
            </p>
          </div>
          
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='bg-white dark:bg-[#1F2020] p-6 rounded-xl border border-gray-200 dark:border-[#2F3030]'>
              <h3 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-3'>Learn</h3>
              <p className='text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed'>
                Explore core computer science concepts and continuously expand into new areas.
              </p>
            </div>
            <div className='bg-white dark:bg-[#1F2020] p-6 rounded-xl border border-gray-200 dark:border-[#2F3030]'>
              <h3 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-3'>Understand</h3>
              <p className='text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed'>
                Focus on intuition, examples, diagrams, and explanations rather than memorizing definitions.
              </p>
            </div>
            <div className='bg-white dark:bg-[#1F2020] p-6 rounded-xl border border-gray-200 dark:border-[#2F3030]'>
              <h3 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-3'>Build</h3>
              <p className='text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed'>
                Apply concepts through programming, problem solving, projects, and system design.
              </p>
            </div>
            <div className='bg-white dark:bg-[#1F2020] p-6 rounded-xl border border-gray-200 dark:border-[#2F3030]'>
              <h3 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-3'>Share</h3>
              <p className='text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed'>
                Document the learning journey so others can learn alongside it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. What I'm Learning & Dynamic Statistics */}
      <section className='max-w-4xl mx-auto px-6 py-20'>
        <h2 className='text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-6'>What I'm Learning & Writing About</h2>
        <p className='text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-12 max-w-3xl'>
          Z Blogs currently focuses on the areas I'm actively studying, and the subjects will continue to expand as I learn more.
        </p>

        {/* Dynamic Category Graph */}
        <div className='bg-gray-50 dark:bg-[#121212] rounded-2xl p-8 border border-gray-200 dark:border-gray-800 mb-8'>
          <h3 className='text-base font-semibold uppercase tracking-wider text-gray-500 mb-8'>Published Articles By Subject</h3>
          
          <div className='space-y-6'>
            {categoryStats.length > 0 ? categoryStats.map((stat) => (
              <div key={stat.category} className='group'>
                <div className='flex justify-between text-base font-medium mb-2'>
                  <span>{getCategoryLabel(stat.category)}</span>
                  <span className='text-gray-500'>{stat.count} articles</span>
                </div>
                <div className='w-full bg-gray-200 dark:bg-[#1F2020] h-3 rounded-full overflow-hidden'>
                  <div 
                    className='bg-teal-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-teal-400'
                    style={{ width: `${(stat.count / maxCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            )) : (
              <p className='text-gray-500 text-base'>Loading subjects...</p>
            )}
          </div>
        </div>

        {/* 6. Optional Supporting Statistics */}
        <div className='flex gap-8 text-base text-gray-500'>
          <div>
            <span className='block text-2xl font-bold text-gray-900 dark:text-white mb-1'>{totalPosts}</span>
            Published Articles
          </div>
          <div>
            <span className='block text-2xl font-bold text-gray-900 dark:text-white mb-1'>{categoryStats.length}</span>
            Active Subjects
          </div>
        </div>
      </section>

      {/* 7. What You'll Find Here */}
      <section className='bg-gray-50 dark:bg-[#121212] py-20 border-y border-gray-200 dark:border-gray-800'>
        <div className='max-w-6xl mx-auto px-6'>
          <h2 className='text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-10'>What You'll Find Here</h2>
          <div className='grid md:grid-cols-2 gap-6'>
            {categoryStats.length > 0 ? categoryStats.map(stat => (
              <div key={stat.category} className='bg-white dark:bg-[#1F2020] p-6 rounded-xl border border-gray-200 dark:border-[#2F3030]'>
                <h3 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-3'>{getCategoryLabel(stat.category)}</h3>
                <p className='text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed'>
                  {getCategoryDescription(stat.category)}
                </p>
              </div>
            )) : (
              <p className='text-gray-500'>Categories will appear here once articles are published.</p>
            )}
          </div>
        </div>
      </section>

      {/* 8 & 9. The Learning Journey & Content Process */}
      <section className='max-w-4xl mx-auto px-6 py-20'>
        <div className='grid md:grid-cols-2 gap-16 items-start'>
          <div>
            <h2 className='text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-6'>Learning in Public</h2>
            <p className='text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-4'>
              I'm still learning too. Some articles document concepts I've recently understood, while others grow out of problems, projects, and deeper exploration. 
            </p>
            <p className='text-gray-600 dark:text-gray-400 font-light leading-relaxed'>
              The goal is to keep improving the explanations as my understanding improves.
            </p>
          </div>
          
          <div className='bg-gray-50 dark:bg-[#121212] p-8 rounded-2xl border border-gray-200 dark:border-gray-800'>
            <h3 className='text-base font-semibold uppercase tracking-wider text-gray-500 mb-6'>How Articles Are Created</h3>
            <div className='flex flex-col gap-3 font-medium text-gray-700 dark:text-gray-300'>
              <div className='flex items-center gap-3'><span className='text-teal-500 font-mono'>01.</span> Learn</div>
              <div className='pl-8 text-gray-400 text-base border-l border-gray-300 dark:border-gray-700 ml-2 py-2'>Research & Understand</div>
              <div className='flex items-center gap-3'><span className='text-teal-500 font-mono'>02.</span> Experiment</div>
              <div className='pl-8 text-gray-400 text-base border-l border-gray-300 dark:border-gray-700 ml-2 py-2'>Solve & Test</div>
              <div className='flex items-center gap-3'><span className='text-teal-500 font-mono'>03.</span> Write</div>
              <div className='pl-8 text-gray-400 text-base border-l border-gray-300 dark:border-gray-700 ml-2 py-2'>Explain & Document</div>
              <div className='flex items-center gap-3'><span className='text-teal-500 font-mono'>04.</span> Improve</div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. How You Can Contribute */}
      <section className='bg-gray-50 dark:bg-[#121212] py-20 border-y border-gray-200 dark:border-gray-800'>
        <div className='max-w-6xl mx-auto px-6'>
          <h2 className='text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-10 text-center'>How You Can Contribute</h2>
          <div className='grid md:grid-cols-4 gap-6'>
            <div className='bg-white dark:bg-[#1F2020] p-6 rounded-xl border border-gray-200 dark:border-[#2F3030]'>
              <h3 className='font-bold mb-2'>Write</h3>
              <p className='text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed'>Members can contribute technical articles once a month and share what they know.</p>
            </div>
            <div className='bg-white dark:bg-[#1F2020] p-6 rounded-xl border border-gray-200 dark:border-[#2F3030]'>
              <h3 className='font-bold mb-2'>Discuss</h3>
              <p className='text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed'>Comments are always open! Ask questions, discuss concepts, and interact with the community.</p>
            </div>
            <div className='bg-white dark:bg-[#1F2020] p-6 rounded-xl border border-gray-200 dark:border-[#2F3030]'>
              <h3 className='font-bold mb-2'>Suggest</h3>
              <p className='text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed'>Allow users to suggest topics that they would like to see covered.</p>
            </div>
            <div className='bg-white dark:bg-[#1F2020] p-6 rounded-xl border border-gray-200 dark:border-[#2F3030]'>
              <h3 className='font-bold mb-2'>Improve</h3>
              <p className='text-gray-600 dark:text-gray-400 text-base font-light leading-relaxed'>Encourage constructive feedback and corrections.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11 & 12. Resources & Where to Go Next */}
      <section className='max-w-4xl mx-auto px-6 py-20'>
        <div className='grid md:grid-cols-2 gap-6'>
          <div className='bg-white dark:bg-[#1F2020] p-8 rounded-2xl border border-gray-200 dark:border-[#2F3030]'>
            <h3 className='text-2xl font-bold mb-4'>Learning Resources</h3>
            <p className='text-gray-600 dark:text-gray-400 mb-8 font-light leading-relaxed'>
              Articles are only one part of the learning process. The Resources section brings together useful references, study material, notes, and downloadable resources to help explore topics further.
            </p>
            <Link to='/resources' className='inline-block font-semibold text-teal-600 dark:text-teal-400 hover:underline'>
              Explore Resources →
            </Link>
          </div>
          
          <div className='bg-teal-50 dark:bg-[#09090b] p-8 rounded-2xl border border-teal-100 dark:border-teal-900/30'>
            <h3 className='text-2xl font-bold mb-4'>Where to Go Next</h3>
            <p className='text-gray-600 dark:text-gray-400 mb-8 font-light leading-relaxed'>
              Start with the latest articles, explore a specific subject, or browse the learning resources.
            </p>
            <div className='flex flex-col gap-4'>
              <Link to='/search' className='inline-block font-semibold text-teal-600 dark:text-teal-400 hover:underline'>
                Read Latest Articles →
              </Link>
              <Link to='/resources' className='inline-block font-semibold text-teal-600 dark:text-teal-400 hover:underline'>
                Browse Resources →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
