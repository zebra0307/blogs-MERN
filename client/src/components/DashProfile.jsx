import { Button, TextInput, Modal, ModalHeader, ModalBody } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutSuccess,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
import TimedAlert from './TimedAlert';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Backend URL with fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

/**
 * DashProfile Component
 * 
 * Features:
 * 1. View profile (username, email, profile picture)
 * 2. Update Profile Modal:
 *    - Profile Picture: Upload inside modal, stored as Base64
 *    - Username: No OTP, just validate uniqueness
 *    - Email: OTP sent to NEW email for verification
 * 3. Change Password: Current password verification required
 * 4. Delete account functionality
 */
export default function DashProfile() {
    const { currentUser, error, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // ==================== UPDATE PROFILE MODAL STATE ====================
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        username: '',
        email: '',
        profilePicture: '',
    });
    const [updateStep, setUpdateStep] = useState('form'); // 'form' | 'email-otp'
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccessMsg, setUpdateSuccessMsg] = useState(null);
    const [pendingNewEmail, setPendingNewEmail] = useState(null);

    // Profile picture upload state (inside modal)
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const filePickerRef = useRef();

    // OTP input state (for email change only)
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState(null);
    const [otpLoading, setOtpLoading] = useState(false);
    const [countdown, setCountdown] = useState(300);
    const otpInputRefs = useRef([]);

    // ==================== CHANGE PASSWORD MODAL STATE ====================
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);

    // ==================== DELETE ACCOUNT MODAL STATE ====================
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // ==================== OTP COUNTDOWN EFFECT ====================
    useEffect(() => {
        let timer;
        if (updateStep === 'email-otp' && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [updateStep, countdown]);

    // ==================== PROFILE PICTURE FUNCTIONS ====================

    /**
     * Convert image file to Base64 string
     */
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    /**
     * Handle image file selection (inside modal)
     */
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setImageUploadError('Image must be less than 2MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setImageUploadError('Please select an image file');
            return;
        }

        setImageUploadError(null);
        setImageUploadProgress(0);

        try {
            // Create preview URL
            setImagePreview(URL.createObjectURL(file));

            // Simulate progress for UX
            const progressInterval = setInterval(() => {
                setImageUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            // Convert to Base64
            const base64 = await convertToBase64(file);

            clearInterval(progressInterval);
            setImageUploadProgress(100);
            setUpdateFormData(prev => ({ ...prev, profilePicture: base64 }));

            // Clear progress after a moment
            setTimeout(() => {
                setImageUploadProgress(null);
            }, 500);

        } catch (error) {
            setImageUploadError('Failed to process image');
            setImageUploadProgress(null);
        }
    };

    // ==================== UPDATE PROFILE MODAL FUNCTIONS ====================

    const openUpdateModal = () => {
        setUpdateFormData({
            username: currentUser.username,
            email: currentUser.email,
            profilePicture: currentUser.profilePicture,
        });
        setImagePreview(null);
        setImageUploadProgress(null);
        setImageUploadError(null);
        setUpdateStep('form');
        setUpdateError(null);
        setUpdateSuccessMsg(null);
        setOtpValues(['', '', '', '', '', '']);
        setOtpError(null);
        setPendingNewEmail(null);
        setShowUpdateModal(true);
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        setUpdateStep('form');
        setUpdateError(null);
        setUpdateSuccessMsg(null);
        setOtpError(null);
        setOtpValues(['', '', '', '', '', '']);
        setPendingNewEmail(null);
        setImagePreview(null);
        setImageUploadProgress(null);
        setImageUploadError(null);
    };

    const handleUpdateFormChange = (e) => {
        setUpdateFormData({ ...updateFormData, [e.target.id]: e.target.value });
    };

    /**
     * Submit update form
     */
    const handleUpdateSubmit = async () => {
        setUpdateError(null);

        const hasUsernameChange = updateFormData.username !== currentUser.username;
        const hasEmailChange = updateFormData.email !== currentUser.email;
        const hasProfilePicChange = updateFormData.profilePicture !== currentUser.profilePicture;

        if (!hasUsernameChange && !hasEmailChange && !hasProfilePicChange) {
            setUpdateError('No changes made');
            return;
        }

        if (updateFormData.username.trim().length < 3) {
            setUpdateError('Username must be at least 3 characters');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateFormData.email)) {
            setUpdateError('Please enter a valid email');
            return;
        }

        setUpdateLoading(true);

        try {
            if (hasEmailChange) {
                const res = await fetch(`${BACKEND_URL}/api/otp/send-email-change-otp`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newEmail: updateFormData.email }),
                });
                const data = await res.json();
                setUpdateLoading(false);

                if (!res.ok || data.success === false) {
                    setUpdateError(data.message || 'Failed to send verification code');
                    return;
                }

                setPendingNewEmail(updateFormData.email);
                setUpdateStep('email-otp');
                setCountdown(300);
                setOtpValues(['', '', '', '', '', '']);
                setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
            } else {
                await updateProfileDirectly({
                    username: hasUsernameChange ? updateFormData.username : undefined,
                    profilePicture: hasProfilePicChange ? updateFormData.profilePicture : undefined,
                });
            }
        } catch (error) {
            setUpdateError(error.message);
            setUpdateLoading(false);
        }
    };

    /**
     * Update profile directly (for username/profile picture - no OTP)
     */
    const updateProfileDirectly = async (updates) => {
        try {
            setUpdateLoading(true);
            dispatch(updateStart());

            const res = await fetch(`${BACKEND_URL}/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            const data = await res.json();
            setUpdateLoading(false);

            if (!res.ok || data.success === false) {
                dispatch(updateFailure(data.message));
                setUpdateError(data.message || 'Failed to update profile');
                return;
            }

            dispatch(updateSuccess(data));
            setUpdateSuccessMsg('Profile updated successfully!');

            setTimeout(() => {
                closeUpdateModal();
            }, 1500);
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateError(error.message);
            setUpdateLoading(false);
        }
    };

    // OTP Input handlers
    const handleOtpChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;
        const newOtp = [...otpValues];
        newOtp[index] = value;
        setOtpValues(newOtp);
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pasteData)) {
            const newOtp = [...otpValues];
            pasteData.split('').forEach((digit, i) => {
                if (i < 6) newOtp[i] = digit;
            });
            setOtpValues(newOtp);
        }
    };

    /**
     * Verify OTP for email change and apply all updates
     */
    const handleVerifyEmailOTP = async () => {
        const otp = otpValues.join('');
        if (otp.length !== 6) {
            setOtpError('Please enter the complete 6-digit code');
            return;
        }

        setOtpError(null);
        setOtpLoading(true);

        try {
            const res = await fetch(`${BACKEND_URL}/api/otp/verify-email-change-otp`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newEmail: pendingNewEmail,
                    otp,
                }),
            });
            const data = await res.json();

            if (!res.ok || data.success === false) {
                setOtpError(data.message || 'Invalid verification code');
                setOtpLoading(false);
                return;
            }

            dispatch(updateSuccess(data));

            const hasUsernameChange = updateFormData.username !== currentUser.username;
            const hasProfilePicChange = updateFormData.profilePicture !== currentUser.profilePicture;

            if (hasUsernameChange || hasProfilePicChange) {
                const updateRes = await fetch(`${BACKEND_URL}/api/user/update/${currentUser._id}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: hasUsernameChange ? updateFormData.username : undefined,
                        profilePicture: hasProfilePicChange ? updateFormData.profilePicture : undefined,
                    }),
                });
                const updateData = await updateRes.json();

                if (updateRes.ok && updateData.success !== false) {
                    dispatch(updateSuccess(updateData));
                }
            }

            setOtpLoading(false);
            setUpdateSuccessMsg('Profile updated successfully!');

            setTimeout(() => {
                closeUpdateModal();
            }, 1500);
        } catch (error) {
            setOtpError(error.message);
            setOtpLoading(false);
        }
    };

    const handleResendEmailOTP = async () => {
        setOtpError(null);
        try {
            const res = await fetch(`${BACKEND_URL}/api/otp/send-email-change-otp`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newEmail: pendingNewEmail }),
            });
            const data = await res.json();

            if (!res.ok || data.success === false) {
                setOtpError(data.message || 'Failed to resend code');
            } else {
                setCountdown(300);
                setOtpValues(['', '', '', '', '', '']);
            }
        } catch (error) {
            setOtpError(error.message);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // ==================== CHANGE PASSWORD MODAL FUNCTIONS ====================

    const openPasswordModal = () => {
        setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordError(null);
        setPasswordSuccess(null);
        setShowPasswordModal(true);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setPasswordError(null);
        setPasswordSuccess(null);
        setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handlePasswordFormChange = (e) => {
        setPasswordFormData({ ...passwordFormData, [e.target.id]: e.target.value });
    };

    const handlePasswordSubmit = async () => {
        setPasswordError(null);
        const { currentPassword, newPassword, confirmPassword } = passwordFormData;

        if (!currentPassword) {
            setPasswordError('Please enter your current password');
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        try {
            setPasswordLoading(true);
            dispatch(updateStart());

            const res = await fetch(`${BACKEND_URL}/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
            });
            const data = await res.json();
            setPasswordLoading(false);

            if (!res.ok || data.success === false) {
                dispatch(updateFailure(data.message));
                setPasswordError(data.message || 'Failed to update password');
                return;
            }

            dispatch(updateSuccess(data));
            setPasswordSuccess('Password updated successfully!');
            setTimeout(() => closePasswordModal(), 1500);
        } catch (error) {
            dispatch(updateFailure(error.message));
            setPasswordError(error.message);
            setPasswordLoading(false);
        }
    };

    // ==================== DELETE ACCOUNT FUNCTION ====================

    const handleDeleteUser = async () => {
        setShowDeleteModal(false);
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`${BACKEND_URL}/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                dispatch(deleteUserFailure(data.message));
            } else {
                dispatch(deleteUserSuccess(data));
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    // ==================== SIGN OUT FUNCTION ====================

    const handleSignout = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/api/user/signout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (res.ok) {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.error('Signout error:', error.message);
        }
    };

    // ==================== RENDER ====================

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-bold text-3xl text-gray-900 dark:text-white'>
                Profile
            </h1>

            {/* ==================== PROFILE DISPLAY SECTION ==================== */}
            <div className='flex flex-col items-center gap-4'>
                {/* Profile Picture (Display Only - Not Clickable) */}
                <div className='w-32 h-32 shadow-md overflow-hidden rounded-full'>
                    <img
                        src={currentUser.profilePicture}
                        alt='user'
                        className='rounded-full w-full h-full object-cover border-4 border-gray-200 dark:border-gray-700'
                    />
                </div>

                {/* User Info Display */}
                <div className='w-full space-y-3 mt-4'>
                    <div className='p-3 bg-gray-100 dark:bg-gray-800 rounded-lg'>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>Username</p>
                        <p className='text-gray-900 dark:text-white font-medium'>{currentUser.username}</p>
                    </div>
                    <div className='p-3 bg-gray-100 dark:bg-gray-800 rounded-lg'>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>Email</p>
                        <p className='text-gray-900 dark:text-white font-medium'>{currentUser.email}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='w-full space-y-3 mt-4'>
                    <Button
                        onClick={openUpdateModal}
                        className='w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border-0'
                    >
                        Update Profile
                    </Button>

                    <Button
                        onClick={openPasswordModal}
                        className='w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border-0'
                    >
                        Change Password
                    </Button>

                    {currentUser.isAdmin && (
                        <Link to='/create-post'>
                            <Button className='w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white'>
                                Create a Post
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Delete Account & Sign Out */}
                <div className='flex justify-between w-full mt-5'>
                    <span onClick={() => setShowDeleteModal(true)} className='cursor-pointer hover:underline font-medium text-red-500'>
                        Delete Account
                    </span>
                    <span onClick={handleSignout} className='cursor-pointer hover:underline font-medium text-gray-600 dark:text-gray-400'>
                        Sign Out
                    </span>
                </div>

                {error && <TimedAlert color='failure' duration={3000}>{error}</TimedAlert>}
            </div>

            {/* ==================== UPDATE PROFILE MODAL ==================== */}
            <Modal show={showUpdateModal} onClose={closeUpdateModal} popup size='md'>
                <ModalHeader />
                <ModalBody>
                    {updateStep === 'form' ? (
                        <div className='space-y-4'>
                            <h3 className='text-lg font-bold text-gray-900 dark:text-white text-center'>Update Profile</h3>
                            <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
                                Email changes require verification on the new email
                            </p>

                            {/* Profile Picture Upload Section */}
                            <div className='flex flex-col items-center'>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    ref={filePickerRef}
                                    hidden
                                />
                                <div
                                    className='w-24 h-24 rounded-full overflow-hidden shadow-md cursor-pointer'
                                    onClick={() => filePickerRef.current.click()}
                                >
                                    {imageUploadProgress !== null && (
                                        <div className='absolute inset-0 flex items-center justify-center z-10' style={{ borderRadius: '50%' }}>
                                            <CircularProgressbar
                                                value={imageUploadProgress || 0}
                                                text={`${imageUploadProgress}%`}
                                                strokeWidth={5}
                                                styles={{
                                                    root: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
                                                    path: { stroke: `rgba(124, 58, 237, ${imageUploadProgress / 100})` },
                                                    text: { fill: '#fff', fontSize: '20px', fontWeight: 'bold' },
                                                }}
                                            />
                                        </div>
                                    )}
                                    <img
                                        src={imagePreview || updateFormData.profilePicture}
                                        alt='profile'
                                        className={`w-full h-full object-cover border-4 border-gray-200 dark:border-gray-600 ${imageUploadProgress !== null && 'opacity-60'}`}
                                    />
                                </div>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>Click to change picture</p>

                                {imageUploadError && (
                                    <p className='text-xs text-red-500 mt-1'>{imageUploadError}</p>
                                )}
                            </div>

                            <div>
                                <label className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>Username</label>
                                <TextInput
                                    type='text'
                                    id='username'
                                    value={updateFormData.username}
                                    onChange={handleUpdateFormChange}
                                    disabled={updateLoading}
                                />
                            </div>

                            <div>
                                <label className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>Email</label>
                                <TextInput
                                    type='email'
                                    id='email'
                                    value={updateFormData.email}
                                    onChange={handleUpdateFormChange}
                                    disabled={updateLoading}
                                />
                            </div>

                            {updateError && (
                                <TimedAlert color='failure' duration={5000} onClose={() => setUpdateError(null)}>
                                    {updateError}
                                </TimedAlert>
                            )}

                            {updateSuccessMsg && (
                                <TimedAlert color='success' duration={3000}>{updateSuccessMsg}</TimedAlert>
                            )}

                            <div className='flex gap-3'>
                                <Button
                                    onClick={handleUpdateSubmit}
                                    disabled={updateLoading}
                                    className='flex-1 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border-0'
                                >
                                    {updateLoading ? 'Processing...' : 'Update'}
                                </Button>
                                <Button color='gray' onClick={closeUpdateModal} disabled={updateLoading}>Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        /* Email OTP Verification Step */
                        <div className='space-y-4'>
                            <h3 className='text-lg font-bold text-gray-900 dark:text-white text-center'>Verify New Email</h3>
                            <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
                                Enter the 6-digit code sent to
                            </p>
                            <p className='text-sm font-medium text-purple-600 dark:text-purple-400 text-center'>{pendingNewEmail}</p>

                            {/* OTP Input Boxes */}
                            <div className='flex justify-center gap-2' onPaste={handleOtpPaste}>
                                {otpValues.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (otpInputRefs.current[index] = el)}
                                        type='text'
                                        inputMode='numeric'
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className='w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors'
                                        disabled={otpLoading}
                                    />
                                ))}
                            </div>

                            {/* Countdown */}
                            <p className='text-center text-sm text-gray-500 dark:text-gray-400'>
                                Code expires in <span className={countdown < 60 ? 'text-red-500 font-medium' : ''}>{formatTime(countdown)}</span>
                            </p>

                            {otpError && (
                                <TimedAlert color='failure' duration={3000} onClose={() => setOtpError(null)}>
                                    {otpError}
                                </TimedAlert>
                            )}

                            {updateSuccessMsg && (
                                <TimedAlert color='success' duration={3000}>{updateSuccessMsg}</TimedAlert>
                            )}

                            <Button
                                onClick={handleVerifyEmailOTP}
                                disabled={otpLoading || otpValues.some(v => v === '')}
                                className='w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white border-0'
                            >
                                {otpLoading ? 'Verifying...' : 'Verify & Update Email'}
                            </Button>

                            <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                                Didn't receive the code?{' '}
                                <button onClick={handleResendEmailOTP} className='font-medium text-purple-600 dark:text-purple-400 hover:underline'>
                                    Resend
                                </button>
                            </p>

                            <button onClick={() => setUpdateStep('form')} className='w-full text-sm text-gray-500 hover:underline'>
                                ← Back to form
                            </button>
                        </div>
                    )}
                </ModalBody>
            </Modal>

            {/* ==================== CHANGE PASSWORD MODAL ==================== */}
            <Modal show={showPasswordModal} onClose={closePasswordModal} popup size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className='space-y-4'>
                        <h3 className='text-lg font-bold text-gray-900 dark:text-white text-center'>Change Password</h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400 text-center'>
                            Enter your current password to verify your identity
                        </p>

                        <div>
                            <label className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>Current Password</label>
                            <TextInput
                                type='password'
                                id='currentPassword'
                                placeholder='Enter current password'
                                value={passwordFormData.currentPassword}
                                onChange={handlePasswordFormChange}
                                disabled={passwordLoading}
                            />
                        </div>

                        <div>
                            <label className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>New Password</label>
                            <TextInput
                                type='password'
                                id='newPassword'
                                placeholder='Enter new password (min 6 characters)'
                                value={passwordFormData.newPassword}
                                onChange={handlePasswordFormChange}
                                disabled={passwordLoading}
                            />
                        </div>

                        <div>
                            <label className='block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>Confirm New Password</label>
                            <TextInput
                                type='password'
                                id='confirmPassword'
                                placeholder='Confirm new password'
                                value={passwordFormData.confirmPassword}
                                onChange={handlePasswordFormChange}
                                disabled={passwordLoading}
                            />
                        </div>

                        {passwordError && (
                            <TimedAlert color='failure' duration={3000} onClose={() => setPasswordError(null)}>
                                {passwordError}
                            </TimedAlert>
                        )}

                        {passwordSuccess && (
                            <TimedAlert color='success' duration={3000}>{passwordSuccess}</TimedAlert>
                        )}

                        <div className='flex gap-3'>
                            <Button
                                onClick={handlePasswordSubmit}
                                disabled={passwordLoading}
                                color='gray'
                                className='flex-1'
                            >
                                {passwordLoading ? 'Updating...' : 'Update Password'}
                            </Button>
                            <Button color='gray' onClick={closePasswordModal} disabled={passwordLoading}>Cancel</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

            {/* ==================== DELETE ACCOUNT MODAL ==================== */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} popup size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-red-500 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg font-bold text-gray-900 dark:text-white'>Delete Account</h3>
                        <p className='mb-5 text-sm text-gray-600 dark:text-gray-400'>
                            Are you sure you want to delete your account? This action cannot be undone.
                        </p>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>Yes, delete</Button>
                            <Button color='gray' onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}
