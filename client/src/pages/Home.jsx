import { Link } from 'react-router-dom';
import HomeSlides from '../components/HomeSlides';
import DotGrid from '../components/DotGrid';


export default function Home() {

  return (
    <div>
      {/* Welcome Section */}
      <div className='relative overflow-hidden border-b border-slate-800 bg-slate-950'>
        <DotGrid
          className='z-0 opacity-80'
          dotSize={10}
          gap={24}
          baseColor='#155e75'
          activeColor='#5eead4'
          proximity={130}
          speedTrigger={140}
          shockRadius={200}
          shockStrength={3}
          returnDuration={1.1}
        />
        <div className='absolute inset-0 z-10 bg-linear-to-b from-slate-950/75 via-slate-950/60 to-slate-950/82' />

        <div className='relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20'>
          <p className='inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-teal-200 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-300/25'>
            Your Public Tech Community
          </p>

          <h1 className='mt-6 max-w-4xl text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight text-white'>
            Learn, interact, and access university resources on{' '}
            <span className='text-teal-300'>Z Blogs</span>
          </h1>

          <p className='mt-6 max-w-3xl text-sm sm:text-base lg:text-lg leading-relaxed text-slate-200'>
            Dive into a vibrant community where you can read insightful technical articles, 
            engage anonymously through comments, and access past university question papers 
            to help you ace your exams.
          </p>

          <div className='mt-8 flex flex-wrap items-center gap-3 sm:gap-4'>
            <Link
              to='/search'
              className='inline-flex items-center justify-center rounded-lg bg-teal-600 hover:bg-teal-700 text-white! text-sm sm:text-base font-semibold px-5 py-2.5 transition-colors shadow-sm'
            >
              Read the blog
            </Link>
            <Link
              to='/resources'
              className='inline-flex items-center justify-center rounded-lg border border-teal-200/70 bg-slate-900/75 text-teal-100! hover:bg-slate-800 hover:border-teal-100 text-sm sm:text-base font-semibold px-5 py-2.5 transition-colors shadow-sm'
            >
              Resources
            </Link>
          </div>

          <div className='mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl'>
            <div className='rounded-lg border border-slate-700 bg-slate-900/55 backdrop-blur-sm px-4 py-3'>
              <p className='text-xs uppercase tracking-wide text-slate-400'>
                Community First
              </p>
              <p className='text-sm font-semibold text-white'>
                Read & Contribute
              </p>
            </div>
            <div className='rounded-lg border border-slate-700 bg-slate-900/55 backdrop-blur-sm px-4 py-3'>
              <p className='text-xs uppercase tracking-wide text-slate-400'>
                Exam Prep
              </p>
              <p className='text-sm font-semibold text-white'>
                Past Question Papers
              </p>
            </div>
            <div className='rounded-lg border border-slate-700 bg-slate-900/55 backdrop-blur-sm px-4 py-3'>
              <p className='text-xs uppercase tracking-wide text-slate-400'>
                Privacy
              </p>
              <p className='text-sm font-semibold text-white'>
                100% Anonymous Interaction
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* Homepage Slides: FAQs */}
      <HomeSlides />
    </div>
  );
}

