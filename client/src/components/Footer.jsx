import { Footer, FooterLink, FooterLinkGroup, FooterTitle } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsEnvelope } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <Footer id='site-footer' container className='border-t-4 border-gray-300 dark:border-gray-700'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/'
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white flex items-center gap-2 px-3 py-2 -ml-3 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 w-fit'
            >
              <img src='/logo.png' alt='Z Blogs' className='h-8 w-8 rounded' />
              <span className='text-gray-900 dark:text-white'>Blogs</span>
            </Link>
          </div>
          <div className='flex flex-wrap gap-12 mt-4 sm:gap-16 justify-end'>
            <div>
              <FooterTitle title='Contact us' className='text-gray-900 dark:text-white' />
              <FooterLinkGroup col>
                <FooterLink
                  href='/contact'
                  className='p-0! text-gray-700! dark:text-gray-300!'
                >
                  <div className='flex items-center gap-2 px-3 py-2 -ml-3 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'>
                    <BsEnvelope className='text-gray-700 dark:text-gray-300' />
                    <span>Send a Message</span>
                  </div>
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title='Resources' className='text-gray-900 dark:text-white' />
              <FooterLinkGroup col>
                <FooterLink href='/resources' className='text-gray-700 dark:text-gray-300 hover:text-teal-500'>
                  Data Structure
                </FooterLink>
                <FooterLink href='/resources' className='text-gray-700 dark:text-gray-300 hover:text-teal-500'>
                  Web Development
                </FooterLink>
                <FooterLink href='/resources' className='text-gray-700 dark:text-gray-300 hover:text-teal-500'>
                  Blockchain
                </FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        {/* Divider */}
        <div className='w-full border-t border-gray-200 dark:border-gray-700 mt-6'></div>
        {/* Copyright */}
        <p className='text-center text-sm text-gray-500 dark:text-gray-400 py-4'>
          © {new Date().getFullYear()} Z Blog. All rights reserved.
        </p>
      </div>
    </Footer>
  );
}