import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiLockPasswordLine, RiLogoutCircleRLine } from "react-icons/ri";


export default function DashboardHeader() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.removeItem('token');
        navigate('/user/login');
    }

    return (
        <header className="w-full">
            <div className='flex flex-wrap justify-center items-center md:justify-between lg:justify-between mx-16 my-3'>
                <Link to='/'><img src="https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nby5wbmciLCJpYXQiOjE3MTExODg4NzQsImV4cCI6MTc0MjcyNDg3NH0.KFDnSmauZ-GWjuA9Si0SajJG2a0iizGTKlpVZVjZYQg&t=2024-03-23T10%3A14%3A34.573Z" className="h-8 mix-blend-multiply" alt="Mentore" /></Link>
                <div className='flex items-center gap-4'>
                    <Link to='/user/change-password' type="button" className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm text-blue-700 hover:text-white bg-blue-100 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none duration-200">
                        <RiLockPasswordLine />
                        Change Password
                    </Link>
                    <button onClick={handleLogout} type="button" className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm text-red-700 hover:text-white bg-red-100 hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none duration-200">
                        <RiLogoutCircleRLine />
                        Logout
                    </button>
                </div>
            </div>
            <hr className='w-full'></hr>
        </header>
    )
}