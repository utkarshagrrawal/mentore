import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorNotify } from "./toast";

export default function DashboardHeader() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const sendLogoutRequest = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const response = await sendLogoutRequest.json();
        if (response.error) {
            return ErrorNotify(response.error)
        }
        navigate('/login');
    }

    return (
        <>
            <div className='w-full bg-[#d2d2d217]'>
                <div className='flex flex-wrap justify-center items-center md:justify-between lg:justify-between mx-16 my-3'>
                    <Link to='/'><img src="../static/logo.png" className="h-8 mix-blend-multiply" alt="Mentore" /></Link>
                    <div className='flex items-center gap-2'>
                        <Link to='/change-password' type="button" className="flex items-center gap-1 px-3 py-1 font-medium rounded-lg text-sm text-blue-700 hover:text-white border-blue-700 border hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 duration-200">Change password</Link>
                        <button onClick={handleLogout} type="button" className="flex items-center gap-1 px-3 py-1 font-medium rounded-lg text-sm text-red-700 hover:text-white border-red-700 border hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 duration-200">Logout</button>
                    </div>
                </div>
            </div>
            <hr className='w-full'></hr>
        </>
    )
}