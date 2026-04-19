import { useState } from 'react';
import { Link } from 'react-router-dom';
import Threads from '../components/Threads';
import accordRegistryImage from '../assets/accord-registry.png';
import oceanaverseImage from '../assets/oceanaverse.png';
import xsolanaImage from '../assets/xsolana.png';

const projects = [
  {
    id: 'accord-registry',
    title: 'Accord Registry',
    oneLiner:
      'Agreement workflow platform focused on verification flow, role-based actions, and traceable records.',
    image: accordRegistryImage,
    status: 'Active',
    repoUrl: 'https://github.com/zebra0307/accord-registry_protocol',
    liveUrl: 'https://accordregistry.vercel.app/',
    techTags: ['React', 'Node.js', 'MongoDB', 'JWT Auth'],
    detail: {
      overview:
        'Accord Registry is a full-stack workflow project for managing agreement records and validation steps. It demonstrates practical handling of auth, CRUD operations, and reliable data tracking.',
      whyBuilt:
        'I built it to deepen backend and API design skills, especially around protected routes and lifecycle-driven data updates in product-like scenarios.',
      architecture:
        'The frontend manages user actions and status views, while the backend enforces role-based checks and record updates. MongoDB stores agreement states, and API endpoints keep the workflow consistent.',
      stack:
        'Frontend: React | Backend: Node.js + Express | Database: MongoDB | Auth: JWT + Cookies | Deployment: Vercel + Render',
      progress:
        'Current stage is active iteration. Core flows are implemented, and I am refining validation behavior, UX clarity, and failure handling.',
      potentialValue:
        'This project is useful for understanding document or process workflows and helps me practice scalable API design and state consistency.',
      roadmap: [
        'Add audit timeline and richer record history',
        'Improve role permissions and admin controls',
        'Add integration-friendly export endpoints',
      ],
    },
  },
  {
    id: 'oceanaverse',
    title: 'Oceanaverse',
    oneLiner:
      'Web product experience focused on responsive UX, modular components, and cleaner user onboarding flow.',
    image: oceanaverseImage,
    status: 'MVP',
    repoUrl: 'https://github.com/zebra0307/blue-carbon-registry',
    liveUrl: 'https://oceanaverse.vercel.app/',
    techTags: ['Next.js', 'Tailwind', 'TypeScript', 'Vercel'],
    detail: {
      overview:
        'Oceanaverse is a frontend-first product build that emphasizes discoverable content flow, clean component structure, and responsive interaction patterns.',
      whyBuilt:
        'I built it to improve product-oriented frontend engineering, including layout systems, reusable UI primitives, and performance-aware rendering.',
      architecture:
        'The project is organized around reusable sections and route-level composition. I focused on separating UI concerns and keeping state predictable at feature boundaries.',
      stack:
        'Framework: Next.js | UI: Tailwind CSS | Language: TypeScript/JavaScript | Deployment: Vercel',
      progress:
        'MVP is complete with the main interaction journey. I am currently refining accessibility, micro-interactions, and consistency across sections.',
      potentialValue:
        'It demonstrates product thinking beyond static pages and helps me build stronger instincts for UX clarity and maintainable frontend architecture.',
      roadmap: [
        'Improve content personalization sections',
        'Add analytics-backed UX iteration loop',
        'Optimize bundle-level performance and loading states',
      ],
    },
  },
  {
    id: 'xsolana',
    title: 'xSolana Twitter',
    oneLiner:
      'Solana-focused dashboard for exploring wallet activity, transaction patterns, and developer-facing insights.',
    image: xsolanaImage,
    status: 'In Progress',
    repoUrl: 'https://github.com/zebra0307/solana-twitter-dapp',
    liveUrl: 'https://solana-twitter-dapp-zebra0307.vercel.app/',
    techTags: ['React', 'Solana APIs', 'Node.js', 'Charts'],
    detail: {
      overview:
        'xSolana is a data-heavy dashboard project built to aggregate and present wallet-level and transaction-level blockchain insights in a clear interface.',
      whyBuilt:
        'I wanted to practice systems-style thinking around external APIs, transformed datasets, and reliable client rendering of high-volume information.',
      architecture:
        'The backend fetches and shapes blockchain data, and the frontend focuses on query controls, visual summaries, and drill-down interactions. The design prioritizes understandable data flow and response handling.',
      stack:
        'Frontend: React | Backend: Node.js + Express | Data Source: Solana APIs | Visualization: chart components | Deployment: Vercel + Render',
      progress:
        'This project is in progress. Baseline fetching and summary visualizations are done, with ongoing work on filtering and historical comparisons.',
      potentialValue:
        'It can evolve into a useful monitoring and learning tool for wallet behavior while helping me improve API orchestration and dashboard design.',
      roadmap: [
        'Add richer filters and time-based comparisons',
        'Introduce caching layer for stable response times',
        'Expand wallet profile and anomaly indicators',
      ],
    },
  },
];

export default function Projects() {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);

  const selectedProject =
    projects.find(project => project.id === selectedProjectId) || projects[0];

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    const detailSection = document.getElementById('project-detail');
    if (detailSection) {
      detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='relative overflow-hidden bg-slate-950 py-16 md:py-24'>
        <Threads
          className='z-0'
          color={[0.24, 0.78, 0.70]}
          amplitude={0.7}
          distance={0.07}
          enableMouseInteraction
          respectReducedMotion
        />
        <div className='absolute inset-0 bg-linear-to-b from-slate-950/65 via-slate-950/45 to-slate-950/75 z-10' />

        <div className='relative z-20 max-w-5xl mx-auto px-6 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Projects
          </h1>
          <p className='text-lg md:text-xl text-slate-200 max-w-3xl mx-auto'>
            These projects are where I apply weekly learning in data structures,
            C++, web development, and systems thinking. I treat them like real
            product builds with clear architecture, practical UX decisions, and
            iterative deployment.
          </p>
          <div className='mt-6 flex flex-wrap items-center justify-center gap-3 text-sm'>
            <span className='px-3 py-1 rounded-full border border-teal-300/30 text-teal-100 bg-teal-500/10'>
              Learning-driven
            </span>
            <span className='px-3 py-1 rounded-full border border-teal-300/30 text-teal-100 bg-teal-500/10'>
              Product-minded
            </span>
            <span className='px-3 py-1 rounded-full border border-teal-300/30 text-teal-100 bg-teal-500/10'>
              Iterative engineering
            </span>
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className='max-w-6xl mx-auto px-6 py-14'>
        <div className='flex flex-col gap-2 mb-8'>
          <h2 className='text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white'>
            build build build
          </h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {projects.map((project) => {
            const isSelected = project.id === selectedProjectId;
            return (
              <article
                key={project.id}
                role='button'
                tabIndex={0}
                onClick={() => handleSelectProject(project.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleSelectProject(project.id);
                  }
                }}
                className={`rounded-2xl overflow-hidden border transition-colors bg-white dark:bg-gray-900 ${
                  isSelected
                    ? 'border-teal-500 shadow-md'
                    : 'border-gray-200 dark:border-gray-800 hover:border-teal-500'
                }`}
              >
                <img
                  src={project.image}
                  alt={`${project.title} banner`}
                  className='h-44 w-full object-cover'
                />

                <div className='p-5 space-y-4'>
                  <div className='flex items-start justify-between gap-3'>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                      {project.title}
                    </h3>
                    <span className='text-xs px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 whitespace-nowrap'>
                      {project.status}
                    </span>
                  </div>

                  <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
                    {project.oneLiner}
                  </p>

                  <div className='flex flex-wrap gap-2'>
                    {project.techTags.map((tag) => (
                      <span
                        key={tag}
                        className='text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className='flex items-center gap-3'>
                    <a
                      href={project.repoUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:underline'
                    >
                      GitHub
                    </a>
                    <span className='text-gray-400'>•</span>
                    <a
                      href={project.liveUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:underline'
                    >
                      Live Demo
                    </a>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

        {/* Project Detail View */}
        <section
          id='project-detail'
          className='mt-16 p-8 md:p-10 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900'
        >
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-3'>
            {selectedProject.title}
          </h2>
          <p className='text-gray-600 dark:text-gray-400 leading-relaxed mb-8'>
            {selectedProject.oneLiner}
          </p>

          <div className='flex flex-wrap items-center gap-3 mb-8'>
            <a
              href={selectedProject.repoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center px-4 py-2 rounded-lg bg-gray-900 dark:bg-black text-white! text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-950 transition-colors'
            >
              View GitHub
            </a>
            <a
              href={selectedProject.liveUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center px-4 py-2 rounded-lg bg-teal-600 text-white! text-sm font-medium hover:bg-teal-700 transition-colors'
            >
              Open Live Demo
            </a>
          </div>

          <div className='space-y-7'>
            <div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Overview
              </h3>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                {selectedProject.detail.overview}
              </p>
            </div>

            <div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Why I Built It
              </h3>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                {selectedProject.detail.whyBuilt}
              </p>
            </div>

            <div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                How It Is Built (Architecture)
              </h3>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                {selectedProject.detail.architecture}
              </p>
            </div>

            <div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Tech Stack
              </h3>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                {selectedProject.detail.stack}
              </p>
            </div>

            <div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Current Progress
              </h3>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                {selectedProject.detail.progress}
              </p>
            </div>

            <div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Potential Value
              </h3>
              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                {selectedProject.detail.potentialValue}
              </p>
            </div>

            <div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
                What Is Next (Roadmap)
              </h3>
              <ul className='space-y-2'>
                {selectedProject.detail.roadmap.map((item) => (
                  <li key={item} className='flex items-start gap-3 text-gray-600 dark:text-gray-400'>
                    <span className='text-teal-500 mt-1'>→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className='mt-10 text-center'>
          <p className='text-sm md:text-base text-gray-600 dark:text-gray-400'>
            I also write weekly about the engineering concepts behind these
            projects on my blog.
          </p>
          <Link
            to='/search'
            className='inline-block mt-2 text-teal-600 dark:text-teal-400 font-medium hover:underline'
          >
            Read latest technical posts →
          </Link>
        </div>
      </div>
    </div>
  );
}
