import { Footer, FooterCopyright, FooterDivider, FooterIcon, FooterLink, FooterLinkGroup, FooterTitle } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble, BsDiscord } from 'react-icons/bs';
export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/'
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'
            >
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                Satyendra's
              </span>
              Blog
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <FooterTitle title='About' />
              <FooterLinkGroup col>
                
                <FooterLink
                  href='/about'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Satyendra's Blog
                </FooterLink>
              </FooterLinkGroup>
            </div>
            <div>
              <FooterTitle title='Follow on' />
              <FooterLinkGroup col>
                <FooterLink
                  href='https://www.github.com/zebra0307'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Github
                </FooterLink>
                <FooterLink href='https://discord.com/channels/zebra_0307' >Discord</FooterLink>
                <FooterLink href='https://twitter.com/zebradotsol'>Twitter</FooterLink>
              </FooterLinkGroup>
            </div>
          </div>
        </div>
        <FooterDivider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <FooterCopyright
            href='#'
            by="Satyendra's blog"
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
           
            <FooterIcon href='https://github.com/zebra0307' icon={BsGithub} />
            <FooterIcon href='https://twitter.com/zebradotsol' icon={BsTwitter} />
            <FooterIcon href='https://discord.com/channels/zebra_0307' icon={BsDiscord} />

          </div>
        </div>
      </div>
    </Footer>
  );
}