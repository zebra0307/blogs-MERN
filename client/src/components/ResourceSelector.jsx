import { Button, Modal, ModalHeader, ModalBody, TextInput, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function ResourceSelector({ onInsert }) {
  const [showModal, setShowModal] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResources = async (search = '') => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/resource/getresources?searchTerm=${search}`);
      if (res.ok) {
        const data = await res.json();
        setResources(data.resources);
      }
    } catch (error) {
      console.log(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (showModal) {
      fetchResources();
    }
  }, [showModal]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources(searchTerm);
  };

  return (
    <>
      <Button 
        type="button" 
        className='bg-linear-to-r from-teal-500 to-lime-500 hover:from-teal-600 hover:to-lime-600 text-white! border-0'
        size='sm' 
        onClick={() => setShowModal(true)}
      >
        Attach Resource
      </Button>

      <Modal show={showModal} onClose={() => setShowModal(false)} size="2xl">
        <ModalHeader>Select a Resource to Embed</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <TextInput
              className="flex-1"
              type='text'
              placeholder='Search resources...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={AiOutlineSearch}
            />
            <Button type="submit" className='bg-linear-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white! border-0'>Search</Button>
          </form>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {loading ? (
              <div className="flex justify-center p-4"><Spinner /></div>
            ) : resources.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No resources found.</p>
            ) : (
              resources.map((resource) => (
                <div 
                  key={resource._id} 
                  className="flex justify-between items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{resource.title}</h4>
                    <span className='bg-teal-100 text-teal-800 text-[10px] font-medium px-2 py-0.5 rounded dark:bg-teal-900 dark:text-teal-300'>
                      {resource.category}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    className='bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white! border-0'
                    onClick={() => {
                      onInsert(resource._id);
                      setShowModal(false);
                    }}
                  >
                    Insert
                  </Button>
                </div>
              ))
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
