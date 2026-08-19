import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsGithub, BsEnvelope, BsTwitter } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <Footer id='site-footer' container className='border-t border-[#2F3030] bg-[#1F2020] rounded-none shadow-none'>
      <div className='w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center py-4 gap-4'>
        
        {/* Brand */}
        <Link to='/' className='flex items-center gap-2 text-white font-semibold'>
          <img src='/logo.png' alt='Z Blogs' className='h-6 w-6 rounded' />
          <span className='text-white'>Blogs</span>
        </Link>

        {/* Links */}
        <div className='flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-300'>
          <Link to='/about' className='hover:text-teal-400 transition-colors'>About</Link>
          <Link to='/resources' className='hover:text-teal-400 transition-colors'>Resources</Link>
          <Link to='/contact' className='hover:text-teal-400 transition-colors flex items-center gap-1'>
            <BsEnvelope /> Contact
          </Link>
          <a href='https://github.com/zebra0307' target='_blank' rel='noopener noreferrer' className='hover:text-teal-400 transition-colors flex items-center gap-1'>
            <BsGithub /> GitHub
          </a>
          <a href='https://x.com/zebra0307' target='_blank' rel='noopener noreferrer' className='hover:text-teal-400 transition-colors flex items-center gap-1'>
            <BsTwitter /> Twitter
          </a>
        </div>

        {/* Copyright */}
        <div className='text-sm text-gray-400'>
          © {new Date().getFullYear()} Blogs
        </div>

      </div>
    </Footer>
  );
}