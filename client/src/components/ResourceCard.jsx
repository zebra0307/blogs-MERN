import { Button } from 'flowbite-react';
import { HiDownload, HiEye } from 'react-icons/hi';

export default function ResourceCard({ resource }) {
  return (
    <div className='flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full'>
      <div className='p-6 flex-1'>
        <div className='flex justify-between items-start mb-4'>
          <span className='bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-teal-900 dark:text-teal-300'>
            {resource.category}
          </span>
          <span className='text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded'>
            {resource.resourceType || 'PDF'}
          </span>
        </div>
        
        <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2'>
          {resource.title}
        </h3>
        
        <p className='text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4'>
          {resource.description}
        </p>
      </div>
      
      <div className='p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 flex justify-between gap-3 mt-auto'>
        <Button
          color='gray'
          className='flex-1'
          onClick={() => window.open(resource.fileUrl, '_blank')}
        >
          <HiEye className='mr-2 h-5 w-5' />
          View
        </Button>
        <Button
          gradientDuoTone='purpleToBlue'
          className='flex-1'
          onClick={async () => {
            try {
              let downloadUrl = resource.fileUrl;
              if (downloadUrl.includes('/upload/')) {
                downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
              }
              
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = `${resource.title}.pdf`;
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } catch (error) {
              console.error('Download failed', error);
            }
          }}
        >
          <HiDownload className='mr-2 h-5 w-5' />
          Download
        </Button>
      </div>
    </div>
  );
}
