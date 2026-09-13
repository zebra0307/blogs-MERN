import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://z-blogs.onrender.com';

export default function Comment({ comment, allComments = [], onLike, onEdit, onDelete, onReply }) {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    
    // Reply states
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const { currentUser } = useSelector((state) => state.user);

    // Get nested replies
    const replies = allComments.filter(c => c.replyTo === comment._id);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(
                    `${BACKEND_URL}/api/user/${comment.userId}`
                );
                const data = await res.json();
                if (res.ok) {
                    setUser(data);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        getUser();
    }, [comment]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    };

    const handleSave = async () => {
        try {
            const res = await fetch(
                `${BACKEND_URL}/api/comment/editComment/${comment._id}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: editedContent,
                    }),
                }
            );
            if (res.ok) {
                setIsEditing(false);
                onEdit(comment, editedContent);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const submitReply = async (e) => {
        e.preventDefault();
        setIsSubmittingReply(true);
        const success = await onReply(replyContent, comment._id);
        if (success) {
            setReplyContent('');
            setIsReplying(false);
        }
        setIsSubmittingReply(false);
    };

    return (
        <div className='flex flex-col p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex'>
                <div className='flex-shrink-0 mr-3'>
                    <img
                        className='w-10 h-10 rounded-full bg-gray-200'
                        src={user.profilePicture || '/default-profile.png'}
                        alt={user.username || 'user'}
                    />
                </div>
                <div className='flex-1'>
                    <div className='flex items-center mb-1'>
                        <span className='font-bold mr-1 text-xs truncate'>
                            {user.username ? `@${user.username}` : 'anonymous user'}
                        </span>
                        <span className='text-gray-500 text-xs'>
                            {moment(comment.createdAt).fromNow()}
                        </span>
                    </div>
                    {isEditing ? (
                        <>
                            <Textarea
                                className='mb-2'
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />
                            <div className='flex justify-end gap-2 text-xs'>
                                <Button
                                    type='button'
                                    size='sm'
                                    className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white'
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    type='button'
                                    size='sm'
                                    className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white'
                                    outline
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className='text-gray-500 pb-2'>{comment.content}</p>
                            <div className='flex items-center pt-2 text-xs max-w-fit gap-2'>
                                <button
                                    type='button'
                                    onClick={() => onLike(comment._id)}
                                    className={`text-gray-400 hover:text-blue-500 ${currentUser &&
                                        comment.likes?.includes(currentUser._id) &&
                                        '!text-blue-500'
                                        }`}
                                >
                                    <FaThumbsUp className='text-sm' />
                                </button>
                                <p className='text-gray-400'>
                                    {comment.numberOfLikes > 0 &&
                                        comment.numberOfLikes +
                                        ' ' +
                                        (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                                </p>
                                {currentUser && (
                                    <button
                                        type='button'
                                        onClick={() => setIsReplying(!isReplying)}
                                        className='text-gray-400 hover:text-blue-500 ml-2'
                                    >
                                        Reply
                                    </button>
                                )}
                                {currentUser &&
                                    (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                        <>
                                            <button
                                                type='button'
                                                onClick={handleEdit}
                                                className='text-gray-400 hover:text-blue-500 ml-2'
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => onDelete(comment._id)}
                                                className='text-gray-400 hover:text-red-500 ml-2'
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                            </div>
                        </>
                    )}
                    
                    {/* Reply Form */}
                    {isReplying && (
                        <div className="mt-4 mb-2 pr-4">
                            <Textarea
                                placeholder='Write a reply...'
                                rows='2'
                                maxLength='200'
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                className="mb-2 text-sm"
                            />
                            <div className='flex justify-between items-center'>
                                <span className='text-xs text-gray-500'>{200 - replyContent.length} chars left</span>
                                <div className='flex gap-2'>
                                    <Button size="xs" color="gray" onClick={() => setIsReplying(false)}>Cancel</Button>
                                    <Button 
                                        size="xs" 
                                        className='bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white' 
                                        onClick={submitReply}
                                        disabled={isSubmittingReply || !replyContent.trim()}
                                    >
                                        {isSubmittingReply ? '...' : 'Reply'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Render Nested Replies */}
            {replies.length > 0 && (
                <div className="ml-8 mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    {replies.map(reply => (
                        <Comment
                            key={reply._id}
                            comment={reply}
                            allComments={allComments}
                            onLike={onLike}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
