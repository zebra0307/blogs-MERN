import { Button } from 'flowbite-react';

export default function CallToAction() {
    return (
        <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
            <div className="flex-1 justify-center flex flex-col">
                <h2 className='text-2xl text-gray-900 dark:text-white'>
                    Want to learn more about projects?
                </h2>
                <p className='text-gray-500 dark:text-gray-400 my-2'>
                    Checkout these blogs with complete roadmaps
                </p>
                <Button className='rounded-tl-xl rounded-bl-none bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800'>
                    <a href="/search" className='text-white'>
                        Explore Blogs
                    </a>
                </Button>
            </div>
            <div className="p-7 flex-1">
                <img
                    src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg"
                    alt="JavaScript illustration"
                    className='rounded-lg'
                />
            </div>
        </div>
    )
}
