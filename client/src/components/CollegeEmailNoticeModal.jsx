import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isCollegeStudent } from '../utils/authUtils';
import { HiOutlineLockClosed } from 'react-icons/hi';

export default function CollegeEmailNoticeModal() {
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Only show if the user is not a college student
    if (!isCollegeStudent(currentUser)) {
      const hasDismissed = sessionStorage.getItem('collegeNoticeDismissed');
      if (!hasDismissed) {
        // Show after a slight delay for better UX
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentUser]);

  const handleDismiss = () => {
    sessionStorage.setItem('collegeNoticeDismissed', 'true');
    setShowModal(false);
  };

  const handleLogin = () => {
    handleDismiss();
    navigate('/sign-in');
  };

  return (
    <Modal
      show={showModal}
      onClose={handleDismiss}
      popup
      size='md'
      className='z-[9999]'
    >
      <ModalHeader />
      <ModalBody>
        <div className='text-center'>
          <HiOutlineLockClosed className='mx-auto mb-4 h-14 w-14 text-amber-500 dark:text-amber-400' />
          <h3 className='mb-5 text-lg font-normal text-gray-700 dark:text-gray-300'>
            <strong>AKTU Papers Access</strong> <br />
            To access AKTU (REC Sonbhadra) question papers, please log in using your college email ID.
          </h3>
          <div className='flex justify-center gap-4'>
            <Button
              className='bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white border-0'
              onClick={handleLogin}
            >
              Login
            </Button>
            <Button color='gray' onClick={handleDismiss}>
              Maybe Later
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
