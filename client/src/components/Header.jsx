import { Avatar, Button, Dropdown, DropdownHeader, DropdownItem, DropdownDivider, Navbar, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';

import { signoutSuccess } from '../redux/user/userSlice';
import SearchAutocomplete from './SearchAutocomplete';
import SubscribeModal from './SubscribeModal';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const searchTerm = new URLSearchParams(location.search).get('searchTerm') || '';
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  const handleSignout = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/user/signout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar 
      className='header-nav border-b border-[#2F3030] bg-[#1F2020] sticky top-0 z-[9999]'
      theme={{
        root: {
          inner: {
            base: 'mx-auto flex flex-wrap items-center justify-between',
            fluid: {
              on: '',
              off: 'max-w-7xl w-full'
            }
          }
        }
      }}
    >
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold text-white flex items-center gap-2 px-3 py-2 -ml-3 rounded-full transition-colors hover:bg-[#2F3030]'
      >
        <img src='/logo.png' alt='Z Blogs' className='h-8 w-8 rounded' />
        <span className='text-white'>Blogs</span>
      </Link>

      {/* Desktop Search with Autocomplete */}
      <SearchAutocomplete
        initialValue={searchTerm}
        className='hidden lg:block w-64'
      />

      {/* Mobile Search Button */}
      <Button
        className='w-12 h-10 lg:hidden'
        color='gray'
        pill
        onClick={() => navigate('/search')}
      >
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button 
          onClick={() => setIsSubscribeOpen(true)}
          className='hidden sm:block font-semibold mr-2 bg-transparent border border-gray-500 text-gray-300 hover:bg-[#2F3030] hover:text-white transition-colors'
        >
          Subscribe
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
            theme={{
              floating: {
                base: 'z-[9999] w-fit rounded-lg divide-y divide-gray-100 shadow-lg focus:outline-none bg-white dark:bg-gray-800 dark:divide-gray-600',
                content: 'py-1 text-sm text-gray-700 dark:text-gray-200',
                header: 'block py-2 px-4 text-sm text-gray-700 dark:text-gray-200',
                item: {
                  base: 'flex items-center justify-start py-2 px-4 text-sm text-gray-700 cursor-pointer w-full hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white',
                },
              },
            }}
          >
            <DropdownHeader className='dark:text-gray-200'>
              <span className='block text-sm font-semibold dark:text-white'>@{currentUser.username}</span>
              <span className='block text-sm text-gray-500 truncate dark:text-gray-400'>
                {currentUser.email}
              </span>
            </DropdownHeader>
            <DropdownDivider className='dark:border-gray-600' />
            <Link to={'/dashboard?tab=profile'}>
              <DropdownItem className='dark:text-gray-200 dark:hover:bg-gray-600'>Profile</DropdownItem>
            </Link>
            <DropdownDivider className='dark:border-gray-600' />
            <DropdownItem onClick={handleSignout} className='dark:text-gray-200 dark:hover:bg-gray-600'>Sign out</DropdownItem>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <Button className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border-0'>
              Sign In
            </Button>
          </Link>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink active={path === '/'} as={Link} to='/'>
          <span className={`px-4 py-2 rounded-full transition-colors hover:bg-[#2F3030] text-gray-300 hover:text-white ${path === '/' ? 'font-bold text-teal-400' : ''}`}>Home</span>
        </NavbarLink>
        <NavbarLink active={path === '/search' || path.startsWith('/post/')} as={Link} to='/search'>
          <span className={`px-4 py-2 rounded-full transition-colors hover:bg-[#2F3030] text-gray-300 hover:text-white ${path === '/search' || path.startsWith('/post/') ? 'font-bold text-teal-400' : ''}`}>Blogs</span>
        </NavbarLink>
        <NavbarLink active={path === '/about'} as={Link} to='/about'>
          <span className={`px-4 py-2 rounded-full transition-colors hover:bg-[#2F3030] text-gray-300 hover:text-white ${path === '/about' ? 'font-bold text-teal-400' : ''}`}>About</span>
        </NavbarLink>
        <NavbarLink active={path === '/resources'} as={Link} to='/resources'>
          <span className={`px-4 py-2 rounded-full transition-colors hover:bg-[#2F3030] text-gray-300 hover:text-white ${path === '/resources' ? 'font-bold text-teal-400' : ''}`}>
            Resources
          </span>
        </NavbarLink>
      </NavbarCollapse>
      
      <SubscribeModal 
        show={isSubscribeOpen} 
        onClose={() => setIsSubscribeOpen(false)} 
      />
    </Navbar>
  );
}
