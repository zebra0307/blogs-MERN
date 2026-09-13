import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { POST_CATEGORIES } from '../utils/categories';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

const categoryDescriptions = {
  'data-structures-algorithms': 'Problem solving, algorithms, complexity analysis, and competitive programming.',
  'database-management-system': 'SQL, normalization, indexing, transactions, and database internals.',
  'operating-system': 'Processes, threads, scheduling, memory, synchronization, and deadlocks.',
  'system-design': 'Scalability, caching, APIs, distributed systems, and architecture.',
};

const getCategoryDescription = (categoryId) => {
  if (categoryDescriptions[categoryId]) return categoryDescriptions[categoryId];
  return `Technical articles and deep dives into ${categoryId.split('-').join(' ')}.`;
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
            if (stat.category === 'uncategorized' || stat.category === 'uncategorised') return;
            const cat = legacyMap[stat.category] || stat.category;
            mergedStats[cat] = (mergedStats[cat] || 0) + stat.count;
          });
          const validCategoryValues = POST_CATEGORIES.map(c => c.value);
          const formattedStats = Object.keys(mergedStats)
            .filter(key => validCategoryValues.includes(key))
            .map(key => ({ category: key, count: mergedStats[key] }))
            .sort((a, b) => b.count - a.count);
          setCategoryStats(formattedStats);
          setTotalPosts(formattedStats.reduce((acc, curr) => acc + curr.count, 0));
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

      {/* Hero - tight, purposeful */}
      <section className='max-w-3xl mx-auto px-6 pt-14 pb-8 text-center'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-3'>About Z Blogs</h1>
        <p className='text-lg text-teal-600 dark:text-teal-400 font-medium mb-4'>
          Learn. Understand. Build. Share.
        </p>
        <p className='text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed'>
          A learning platform documenting computer science concepts - one article at a time - through clear explanations, diagrams, and practical examples.
        </p>
      </section>

      {/* Stats bar */}
      <div className='max-w-3xl mx-auto px-6 pb-8 flex justify-center gap-10'>
        <div className='text-center'>
          <span className='block text-2xl font-bold text-gray-900 dark:text-white'>{totalPosts}</span>
          <span className='text-xs text-gray-500 uppercase tracking-wider'>Articles</span>
        </div>
        <div className='text-center'>
          <span className='block text-2xl font-bold text-gray-900 dark:text-white'>{categoryStats.length}</span>
          <span className='text-xs text-gray-500 uppercase tracking-wider'>Subjects</span>
        </div>
      </div>

      {/* Pillars - inline, compact */}
      <section className='bg-gray-50 dark:bg-[#121212] border-y border-gray-200 dark:border-gray-800 py-10'>
        <div className='max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
          {['Learn', 'Understand', 'Build', 'Share'].map((pillar, i) => {
            const descriptions = [
              'Core CS concepts, continuously expanding.',
              'Intuition & examples over memorization.',
              'Apply via code, projects & system design.',
              'Document the journey for others.'
            ];
            return (
              <div key={pillar} className='bg-white dark:bg-[#1F2020] p-4 rounded-lg border border-gray-200 dark:border-[#2F3030]'>
                <span className='text-teal-500 font-mono text-xs'>0{i+1}</span>
                <h3 className='font-semibold text-sm mt-1 mb-1'>{pillar}</h3>
                <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed'>{descriptions[i]}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subjects + graph - combined, compact */}
      <section className='max-w-3xl mx-auto px-6 py-10'>
        <h2 className='text-xl font-semibold tracking-tight mb-6'>What I Write About</h2>
        
        {/* Category bars */}
        <div className='space-y-3 mb-8'>
          {categoryStats.length > 0 ? categoryStats.map(stat => (
            <div key={stat.category} className='group'>
              <div className='flex justify-between text-sm mb-1'>
                <span className='font-medium'>{getCategoryLabel(stat.category)}</span>
                <span className='text-gray-400 text-xs'>{stat.count} articles</span>
              </div>
              <div className='w-full bg-gray-200 dark:bg-[#1F2020] h-2 rounded-full overflow-hidden'>
                <div 
                  className='bg-teal-500 h-full rounded-full transition-all duration-700 group-hover:bg-teal-400'
                  style={{ width: `${(stat.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          )) : (
            <p className='text-gray-500 text-sm'>Loading...</p>
          )}
        </div>

        {/* Category cards - grid, tight */}
        <div className='grid md:grid-cols-2 gap-3'>
          {categoryStats.length > 0 && categoryStats.map(stat => (
            <div key={stat.category} className='bg-gray-50 dark:bg-[#1F2020] p-4 rounded-lg border border-gray-200 dark:border-[#2F3030]'>
              <h3 className='font-semibold text-sm mb-1'>{getCategoryLabel(stat.category)}</h3>
              <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed'>{getCategoryDescription(stat.category)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process + Contribute - side by side */}
      <section className='bg-gray-50 dark:bg-[#121212] border-y border-gray-200 dark:border-gray-800 py-10'>
        <div className='max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8'>
          
          {/* How articles are created */}
          <div>
            <h2 className='text-lg font-semibold mb-4'>How Articles Are Created</h2>
            <div className='flex flex-col gap-2 text-sm'>
              {['Learn - Research & understand', 'Experiment - Solve & test', 'Write - Explain & document', 'Improve - Refine over time'].map((step, i) => (
                <div key={i} className='flex items-center gap-3'>
                  <span className='text-teal-500 font-mono text-xs font-bold'>0{i+1}</span>
                  <span className='text-gray-600 dark:text-gray-300'>{step}</span>
                </div>
              ))}
            </div>
            <p className='text-xs text-gray-400 mt-3 leading-relaxed'>
              I'm still learning too. Articles grow out of problems, projects, and deeper exploration.
            </p>
          </div>

          {/* How to contribute */}
          <div>
            <h2 className='text-lg font-semibold mb-4'>Get Involved</h2>
            <div className='grid grid-cols-2 gap-3'>
              {[
                { title: 'Write', desc: 'Members can contribute articles once a month.' },
                { title: 'Discuss', desc: 'Comments are open - ask, debate, share.' },
                { title: 'Suggest', desc: 'Propose topics you want covered.' },
                { title: 'Improve', desc: 'Feedback and corrections welcome.' }
              ].map(item => (
                <div key={item.title} className='bg-white dark:bg-[#1F2020] p-3 rounded-lg border border-gray-200 dark:border-[#2F3030]'>
                  <h3 className='font-semibold text-sm mb-0.5'>{item.title}</h3>
                  <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed'>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA footer - minimal */}
      <section className='max-w-3xl mx-auto px-6 py-10 flex flex-col sm:flex-row gap-4 items-center justify-center'>
        <Link to='/search' className='px-5 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 text-white text-sm font-medium hover:from-gray-600 hover:to-gray-800 transition-all'>
          Read Articles
        </Link>
        <Link to='/resources' className='px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2020] transition-all'>
          Browse Resources
        </Link>
      </section>

    </div>
  );
}
