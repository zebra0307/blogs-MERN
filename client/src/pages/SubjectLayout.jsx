import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner, Button } from 'flowbite-react';
import { HiMenuAlt2, HiX, HiChevronDown, HiChevronRight } from 'react-icons/hi';
import TopicPage from './TopicPage';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

const SUBJECT_MAPPING = {
  'dsa': 'DSA',
  'operating-system': 'Operating System',
  'dbms': 'DBMS',
  'system-design': 'System Design'
};

const SUBJECT_NAMES = {
  'dsa': 'Data Structures & Algorithms',
  'operating-system': 'Operating System Notes',
  'dbms': 'Database Management System',
  'system-design': 'System Design'
};

export default function SubjectLayout() {
  const { subjectSlug, topicSlug } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const location = useLocation();

  const category = SUBJECT_MAPPING[subjectSlug];

  // Group topics by heading
  const groupedTopics = useMemo(() => {
    const groups = [];
    let currentGroup = { heading: null, items: [] };

    topics.forEach(topic => {
      if (topic.resourceType === 'Heading') {
        if (currentGroup.heading || currentGroup.items.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = { heading: topic, items: [] };
      } else {
        currentGroup.items.push(topic);
      }
    });
    if (currentGroup.heading || currentGroup.items.length > 0) {
      groups.push(currentGroup);
    }
    return groups;
  }, [topics]);

  // Auto-expand the group containing the active topic
  useEffect(() => {
    if (topicSlug && groupedTopics.length > 0) {
      const activeGroupIndex = groupedTopics.findIndex(g => g.items.some(t => t.slug === topicSlug));
      if (activeGroupIndex !== -1) {
        setExpandedGroups(prev => ({ ...prev, [activeGroupIndex]: true }));
      }
    }
  }, [topicSlug, groupedTopics]);

  useEffect(() => {
    if (!category) {
      navigate('/resources');
      return;
    }

    const fetchTopics = async () => {
      try {
        setLoading(true);
        // Fetch all resources for this category to build the sidebar
        // order=asc is default in our updated backend logic for documentation flow
        const res = await fetch(`${BACKEND_URL}/api/resource/getresources?category=${category}&limit=100`);
        if (res.ok) {
          const data = await res.json();
          setTopics(data.resources);
          
          // Auto-redirect to the first Markdown topic if no topic is selected
          if (!topicSlug && data.resources.length > 0) {
            const firstTopic = data.resources.find(r => r.resourceType !== 'Heading');
            if (firstTopic) {
              navigate(`/resources/${subjectSlug}/${firstTopic.slug}`, { replace: true });
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectSlug, category, navigate]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  }

  const currentTopicIndex = topics.findIndex(t => t.slug === topicSlug);
  const currentTopic = currentTopicIndex !== -1 ? topics[currentTopicIndex] : null;
  const previousTopic = currentTopicIndex > 0 ? topics[currentTopicIndex - 1] : null;
  const nextTopic = currentTopicIndex < topics.length - 1 ? topics[currentTopicIndex + 1] : null;

  return (
    <div className='min-h-screen bg-white dark:bg-[#000000] flex flex-col'>
      {/* Mobile Sidebar Toggle Header */}
      <div className='md:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#16181c] sticky top-0 z-20'>
        <h2 className='font-semibold text-gray-800 dark:text-gray-200'>
          {SUBJECT_NAMES[subjectSlug]}
        </h2>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='p-2 text-gray-600 dark:text-gray-400 focus:outline-none'
        >
          {sidebarOpen ? <HiX className='w-6 h-6' /> : <HiMenuAlt2 className='w-6 h-6' />}
        </button>
      </div>

      <div className='flex flex-1 max-w-7xl mx-auto w-full'>
        {/* Sidebar */}
        <aside 
          className={`
            ${sidebarOpen ? 'block' : 'hidden'} 
            md:block w-full md:w-56 lg:w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 
            absolute md:sticky md:top-0 h-[calc(100vh-64px)] overflow-y-auto 
            bg-white dark:bg-[#000000] z-10 transition-all
          `}
        >
          <div className='p-4 pb-20 md:pb-4'>
            <Link to="/resources" className='text-sm text-gray-500 hover:text-teal-500 dark:text-gray-400 dark:hover:text-teal-400 mb-6 inline-block font-medium'>
              ← All Resources
            </Link>
            
            <h3 className='font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg hidden md:block'>
              {SUBJECT_NAMES[subjectSlug]}
            </h3>
            
            <nav className='flex flex-col gap-1'>
              {groupedTopics.length === 0 ? (
                <p className='text-gray-500 text-sm'>No topics available yet.</p>
              ) : (
                groupedTopics.map((group, groupIndex) => {
                  const isExpanded = expandedGroups[groupIndex];
                  
                  return (
                    <div key={group.heading ? group.heading._id : `group-${groupIndex}`} className="mb-2">
                      {group.heading && (
                        <button
                          onClick={() => setExpandedGroups(prev => ({ ...prev, [groupIndex]: !isExpanded }))}
                          className="w-full flex items-center justify-between mt-4 mb-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                          <span className="text-left">{group.heading.title}</span>
                          {isExpanded ? <HiChevronDown className="w-4 h-4" /> : <HiChevronRight className="w-4 h-4" />}
                        </button>
                      )}
                      
                      {(!group.heading || isExpanded) && (
                        <div className="flex flex-col gap-1 mt-1">
                          {group.items.map(topic => (
                            <Link
                              key={topic._id}
                              to={`/resources/${subjectSlug}/${topic.slug}`}
                              className={`
                                px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                ${topicSlug === topic.slug 
                                  ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400' 
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                              `}
                            >
                              {topic.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className='flex-1 min-w-0 p-4 sm:p-8 lg:px-12 pb-24'>
          {currentTopic ? (
            <TopicPage 
              topic={currentTopic} 
              subjectSlug={subjectSlug}
              subjectName={SUBJECT_NAMES[subjectSlug]}
              previousTopic={previousTopic}
              nextTopic={nextTopic}
            />
          ) : topicSlug ? (
            <div className='text-center py-20'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>Topic not found</h2>
              <p className='text-gray-500 mt-2'>The requested documentation page does not exist.</p>
              <Link to={`/resources/${subjectSlug}`}>
                <Button className='mt-6 mx-auto bg-linear-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white! border-0'>
                  Back to Overview
                </Button>
              </Link>
            </div>
          ) : (
            <div className='text-center py-20 text-gray-500'>
              Select a topic from the sidebar to begin.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
