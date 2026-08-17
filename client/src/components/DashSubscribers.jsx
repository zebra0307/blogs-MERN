import { Modal, ModalHeader, ModalBody, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, TextInput, Alert, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function DashSubscribers() {
    const { currentUser } = useSelector((state) => state.user);
    const [subscribers, setSubscribers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [subscriberIdToDelete, setSubscriberIdToDelete] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [addStatus, setAddStatus] = useState(null);
    const [addMessage, setAddMessage] = useState('');

    const fetchSubscribers = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/subscribers/getsubscribers`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setSubscribers(data.subscribers);
                if (data.subscribers.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (currentUser.isAdmin) {
            fetchSubscribers();
        }
    }, [currentUser._id, currentUser.isAdmin]);

    const handleShowMore = async () => {
        const startIndex = subscribers.length;
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/subscribers/getsubscribers?startIndex=${startIndex}`,
                {
                    credentials: 'include',
                }
            );
            const data = await res.json();
            if (res.ok) {
                setSubscribers((prev) => [...prev, ...data.subscribers]);
                if (data.subscribers.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteSubscriber = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/subscribers/delete/${subscriberIdToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setSubscribers((prev) => prev.filter((sub) => sub._id !== subscriberIdToDelete));
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleAddSubscriber = async (e) => {
        e.preventDefault();
        setAddStatus('loading');
        setAddMessage('');
        try {
            const res = await fetch(`${BACKEND_URL}/api/subscribers/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: newEmail }),
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setAddStatus('success');
                setAddMessage(data.message);
                setNewEmail('');
                // Refresh list
                fetchSubscribers();
                setTimeout(() => {
                    setShowAddModal(false);
                    setAddStatus(null);
                }, 2000);
            } else {
                setAddStatus('error');
                setAddMessage(data.message);
            }
        } catch (error) {
            setAddStatus('error');
            setAddMessage(error.message);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full'>
            <div className='flex justify-between items-center mb-4 max-w-4xl mx-auto w-full'>
                <h1 className='text-2xl font-bold'>Subscribers</h1>
                <Button 
                    gradientDuoTone='tealToLime' 
                    onClick={() => setShowAddModal(true)}
                >
                    Add Subscriber
                </Button>
            </div>
            
            {currentUser.isAdmin && subscribers.length > 0 ? (
                <div className='max-w-4xl mx-auto w-full'>
                    <Table hoverable className='shadow-md'>
                        <TableHead>
                            <TableHeadCell>Date created</TableHeadCell>
                            <TableHeadCell>Email</TableHeadCell>
                            <TableHeadCell>Status</TableHeadCell>
                            <TableHeadCell>Delete</TableHeadCell>
                        </TableHead>
                        <TableBody className='divide-y'>
                            {subscribers.map((subscriber) => (
                                <TableRow key={subscriber._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <TableCell>
                                        {new Date(subscriber.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <span className='font-medium text-gray-900 dark:text-white'>
                                            {subscriber.email}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            subscriber.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                            subscriber.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {subscriber.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setSubscriberIdToDelete(subscriber._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='w-full text-teal-500 self-center text-sm py-7 hover:underline'
                        >
                            Show more
                        </button>
                    )}
                </div>
            ) : (
                <p className='text-center mt-5 max-w-4xl mx-auto'>You have no subscribers yet!</p>
            )}

            {/* Delete Modal */}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <ModalHeader />
                <ModalBody>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this subscriber?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteSubscriber}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            {/* Add Subscriber Modal */}
            <Modal
                show={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setAddStatus(null);
                    setAddMessage('');
                    setNewEmail('');
                }}
                popup
                size='md'
            >
                <ModalHeader />
                <ModalBody>
                    <div className='text-center'>
                        <h3 className='mb-5 text-lg font-bold text-gray-900 dark:text-white'>
                            Add New Subscriber
                        </h3>
                        <form onSubmit={handleAddSubscriber} className='flex flex-col gap-4'>
                            <TextInput
                                type='email'
                                placeholder='user@example.com'
                                required
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                            <Button 
                                type='submit' 
                                gradientDuoTone='tealToLime' 
                                disabled={addStatus === 'loading' || !newEmail}
                            >
                                {addStatus === 'loading' ? <Spinner size='sm' /> : 'Add Subscriber'}
                            </Button>
                        </form>
                        {addStatus === 'success' && (
                            <Alert color='success' className='mt-4'>
                                {addMessage}
                            </Alert>
                        )}
                        {addStatus === 'error' && (
                            <Alert color='failure' className='mt-4'>
                                {addMessage}
                            </Alert>
                        )}
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}
