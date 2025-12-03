import { useSelector } from 'react-redux';

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <input type="text" placeholder="username" defaultValue={currentUser?.username} className='bg-slate-100 rounded-lg p-3' />
                <input type="email" placeholder="email" defaultValue={currentUser?.email} className='bg-slate-100 rounded-lg p-3' />
                <input type="password" placeholder="password" className='bg-slate-100 rounded-lg p-3' />
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
            </form>
            <div className="flex justify-between mt-5">
                <span className='text-red-700 cursor-pointer'>Delete Account</span>
                <span className='text-red-700 cursor-pointer'>Sign Out</span>
            </div>
        </div>
    );
}
