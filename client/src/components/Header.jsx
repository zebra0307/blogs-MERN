import { Avatar, Button, Dropdown, DropdownHeader, DropdownItem, DropdownDivider, Navbar, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';
import SearchAutocomplete from './SearchAutocomplete';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

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
    <Navbar className='border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black sticky top-0 z-[9999]'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white flex items-center gap-2 px-3 py-2 -ml-3 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-800'
      >
        <img src='/logo.png' alt='Z Blogs' className='h-8 w-8 rounded' />
        <span className='text-gray-900 dark:text-white'>Blogs</span>
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
          className='w-12 h-10'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
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
          <span className={`px-4 py-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white ${path === '/' ? 'font-bold text-black dark:text-white' : ''}`}>Home</span>
        </NavbarLink>
        <NavbarLink active={path === '/about'} as={Link} to='/about'>
          <span className={`px-4 py-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white ${path === '/about' ? 'font-bold text-black dark:text-white' : ''}`}>About</span>
        </NavbarLink>
        <NavbarLink active={path === '/projects'} as={Link} to='/projects'>
          <span className={`px-4 py-2 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white ${path === '/projects' ? 'font-bold text-black dark:text-white' : ''}`}>
            Projects
          </span>
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
