import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUser';
import DashComments from '../components/DashComment';
import DashboardComp from '../components/DashboardComp';

export default function Dashboard() {
  const location = useLocation();
  const tab = new URLSearchParams(location.search).get('tab') || '';
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56 flex-shrink-0'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/* posts... */}
      {tab === 'posts' && <DashPosts />}
      {/* users */}
      {tab === 'users' && <DashUsers />}
      {/* comments  */}
      {tab === 'comments' && <DashComments />}
      {/* dashboard comp */}
      {tab === 'dash' && <DashboardComp />}
    </div>
  );
}