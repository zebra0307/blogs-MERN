export default function ComingSoon() {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='max-w-2xl mx-auto px-6 text-center'>
                {/* Decorative element */}
                <div className='mb-8'>
                    <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                        <span className='text-3xl font-bold text-teal-500'>Z</span>
                    </div>
                </div>

                {/* Heading */}
                <h1 className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4'>
                    Coming Soon...
                </h1>

                {/* Description */}
                <p className='text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto'>
                    We're working hard to bring you something amazing. This feature will be available soon!
                </p>

                {/* Progress indicator */}
                <div className='w-full max-w-xs mx-auto mb-8'>
                    <div className='h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                        <div className='h-full w-3/4 bg-teal-500 rounded-full animate-pulse'></div>
                    </div>
                    <p className='text-xs text-gray-500 dark:text-gray-500 mt-2'>In Development</p>
                </div>

                {/* Back button */}
                <a
                    href='/'
                    className='inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors'
                >
                    <span>←</span>
                    Back to Home
                </a>
            </div>
        </div>
    );
}
