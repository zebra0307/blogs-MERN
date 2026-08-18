import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomeSlides from '../components/HomeSlides';
import DotGrid from '../components/DotGrid';
export default function Home() {
  const { currentUser } = useSelector((state) => state.user);

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

        <div className='relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-12'>
          
          {/* Left Column: Text Content */}
          <div className='flex-1 max-w-2xl w-full'>
            <p className='inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase text-teal-200 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-300/25'>
              Your Public Tech Community
            </p>

            <h1 className='mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white'>
              Learn, interact, and explore technology on{' '}
              <span className='text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-300'>Z Blogs</span>
            </h1>

            <p className='mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-slate-300'>
              Dive into a vibrant community where you can read insightful technical articles, 
              engage anonymously through comments, and explore a wealth of technical knowledge to boost your career.
            </p>

            <div className='mt-8 flex flex-wrap items-center gap-4'>
              <Link
                to='/search'
                className='inline-flex items-center justify-center rounded-lg bg-teal-600 hover:bg-teal-500 text-white! text-base font-semibold px-6 py-3 transition-colors shadow-lg shadow-teal-500/20'
              >
                Read the blog
              </Link>
              <Link
                to='/resources'
                className='inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-900/50 text-slate-200! hover:bg-slate-800 hover:text-white! hover:border-slate-500 text-base font-semibold px-6 py-3 transition-colors backdrop-blur-sm'
              >
                Resources
              </Link>
            </div>

            <div className='mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg'>
              <div className='rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md px-5 py-4'>
                <p className='text-xs uppercase tracking-wider text-teal-400 font-medium'>
                  Community First
                </p>
                <p className='text-sm font-semibold text-slate-200 mt-1'>
                  Read & Contribute
                </p>
              </div>

              <div className='rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md px-5 py-4'>
                <p className='text-xs uppercase tracking-wider text-teal-400 font-medium'>
                  Privacy
                </p>
                <p className='text-sm font-semibold text-slate-200 mt-1'>
                  100% Anonymous
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Zebra Logo */}
          <div className='hidden lg:flex flex-1 justify-center items-center w-full max-w-md relative'>
            <style>
              {`
                @keyframes float-zebra {
                  0% { transform: translateY(0px) scaleX(-1); }
                  50% { transform: translateY(-20px) scaleX(-1); }
                  100% { transform: translateY(0px) scaleX(-1); }
                }
                .animate-float-zebra {
                  animation: float-zebra 6s ease-in-out infinite;
                }
              `}
            </style>
            
            {/* Glowing background blob behind the image */}
            <div className='absolute w-72 h-72 bg-teal-500/20 rounded-full blur-3xl' />
            <div className='absolute w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl translate-x-10 translate-y-10' />
            
            {/* The Zebra Image */}
            <div className='relative z-10 w-full aspect-square max-w-[450px] p-2 rounded-[2rem] bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-black/50'>
              <div className='w-full h-full overflow-hidden rounded-3xl bg-white'>
                <img 
                  src='/zebra-hero.jpg' 
                  alt='Zebra Mascot' 
                  className='w-full h-full object-cover animate-float-zebra origin-center'
                />
              </div>
            </div>
          </div>
          
        </div>
      </div>



      {/* Homepage Slides: FAQs */}
      <HomeSlides />
    </div>
  );
}

