import { Modal, ModalHeader, ModalBody, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');
    const [showPendingOnly, setShowPendingOnly] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let url = currentUser.isAdmin
                    ? `${BACKEND_URL}/api/post/getposts`
                    : `${BACKEND_URL}/api/post/getposts?userId=${currentUser._id}`;
                
                if (currentUser.isAdmin && showPendingOnly) {
                    url += '?isApproved=false';
                }
                const res = await fetch(url, {
                    credentials: 'include',
                });
                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts);
                    if (data.posts.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchPosts();
    }, [currentUser._id, currentUser.isAdmin, showPendingOnly]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            let url = currentUser.isAdmin
                ? `${BACKEND_URL}/api/post/getposts?startIndex=${startIndex}`
                : `${BACKEND_URL}/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`;
                
            if (currentUser.isAdmin && showPendingOnly) {
                url += '&isApproved=false';
            }
            const res = await fetch(url, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserPosts((prev) =>
                    prev.filter((post) => post._id !== postIdToDelete)
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleApprovePost = async (postId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/post/approvepost/${postId}`, {
                method: 'PUT',
                credentials: 'include',
            });
            if (res.ok) {
                setUserPosts((prev) =>
                    prev.map((post) =>
                        post._id === postId ? { ...post, isApproved: true } : post
                    )
                );
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && (
                <div className='flex justify-end mb-4'>
                    <Button 
                        outline 
                        gradientDuoTone="purpleToBlue" 
                        onClick={() => setShowPendingOnly(!showPendingOnly)}
                    >
                        {showPendingOnly ? 'Show All Approved Posts' : 'View Pending Posts'}
                    </Button>
                </div>
            )}
            {userPosts.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Date updated</TableHeadCell>
                                <TableHeadCell>Post image</TableHeadCell>
                                <TableHeadCell>Post title</TableHeadCell>
                                <TableHeadCell>Category</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell>Delete</TableHeadCell>
                                <TableHeadCell>
                                    <span>Edit</span>
                                </TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className='divide-y'>
                            {userPosts.map((post) => (
                                <TableRow key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <TableCell>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className='w-20 h-10 object-cover bg-gray-500'
                                            />
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            className='font-medium text-gray-900 dark:text-white'
                                            to={`/post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{post.category}</TableCell>
                                    <TableCell>
                                        {post.isApproved ? (
                                            <span className='text-green-500 font-semibold'>Approved</span>
                                        ) : (
                                            currentUser.isAdmin ? (
                                                <Button size='xs' color='success' onClick={() => handleApprovePost(post._id)}>Approve</Button>
                                            ) : (
                                                <span className='text-yellow-500 font-semibold'>Pending</span>
                                            )
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostIdToDelete(post._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            className='text-teal-500 hover:underline'
                                            to={`/update-post/${post._id}`}
                                        >
                                            <span>Edit</span>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='w-full text-teal-500 self-center text-sm py-7'
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>You have no posts yet!</p>
            )}
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
                            Are you sure you want to delete this post?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeletePost}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}