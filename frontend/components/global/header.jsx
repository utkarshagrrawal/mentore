import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { MdSpaceDashboard } from "react-icons/md";
import { RiLoginCircleLine } from "react-icons/ri";

export default function Header(props) {
    const navigate = useNavigate();
    const [searchBoxValue, setSearchBoxValue] = useState('');
    const clearId = useRef('');

    const handleLogin = () => {
        if (props?.loggedIn) {
            return navigate('/user/dashboard');
        }
        return navigate('/user/login');
    }

    useEffect(() => {
        if (props?.searchQuery) {
            setSearchBoxValue(props?.searchQuery);
        }
    }, [])

    useEffect(() => {
        const addHeaderClass = () => {
            const header = document.querySelector('header');
            if (window.scrollY > 69) {
                header.classList.add('bg-white', 'shadow-lg', 'fixed', 'z-[999]', 'transition', 'duration-600', 'ease-in-out');
            } else {
                header.classList.remove('bg-white', 'shadow-lg', 'fixed', 'z-[999]');
                setTimeout(() => {
                    header.classList.add('transition', 'duration-600', 'ease-in-out');
                }, 600)
            }
        }
        window.addEventListener('scroll', addHeaderClass);
        return () => window.removeEventListener('scroll', addHeaderClass);
    }, [])

    const handleSearch = (e) => {
        clearTimeout(clearId.current);
        clearId.current = setTimeout(() => {
            navigate('/results?search_query=' + e.target.value);
            props?.setSearchQuery && props?.setSearchQuery(e.target.value);
        }, 500)
        setSearchBoxValue(e.target.value)
    }

    const handleNavigateHome = () => {
        location.href = '/';
        props?.setSearchQuery && props?.setSearchQuery('');
    }

    return (
        <>
            <header className="w-full min-[572px]:block hidden top-0">
                <div>
                    <div className='flex flex-wrap items-center min-[573px]:justify-between min-[760px]:mx-8 min-[830px]:mx-16 mx-4 my-3'>
                        <Link onClick={handleNavigateHome} className="flex items-center justify-center gap-2">
                            <img src="https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nby5wbmciLCJpYXQiOjE3MTIzNDQ0ODEsImV4cCI6MTc0Mzg4MDQ4MX0.R_a_H8TO26tJm794AbsCJzLN4tdFGyF2dIPrnYfWzzg&t=2024-04-05T19%3A14%3A41.780Z" className="h-8 mix-blend-multiply" alt="Mentore" />
                            <span className="text-2xl font-semibold text-blue-700">Mentore</span>
                        </Link>
                        <input type='search' placeholder='Search for domain, mentors...' className='lg:w-[40rem] md:w-[26rem] w-[16rem] border-2 border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300' value={searchBoxValue} onChange={handleSearch} autoFocus />
                        <button
                            onClick={handleLogin}
                            className='flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm text-blue-700 bg-blue-100 hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out'
                        >
                            {props?.loggedIn ? <MdSpaceDashboard /> : <RiLoginCircleLine />}
                            {props?.loggedIn ? 'Dashboard' : 'Login'}
                        </button>
                    </div>
                </div>
                <hr className='w-full' />
            </header>
            <header className="w-full min-[572px]:hidden block">
                <div className=''>
                    <div className='flex flex-wrap items-center justify-between flex-col mx-4 my-3'>
                        <div className="flex justify-between items-center w-full">
                            <Link onClick={handleNavigateHome} className="flex items-center justify-center gap-2">
                                <img src="https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nby5wbmciLCJpYXQiOjE3MTIzNDQ0ODEsImV4cCI6MTc0Mzg4MDQ4MX0.R_a_H8TO26tJm794AbsCJzLN4tdFGyF2dIPrnYfWzzg&t=2024-04-05T19%3A14%3A41.780Z" className="h-8 mix-blend-multiply" alt="Mentore" />
                                <span className="text-2xl font-semibold text-blue-700">Mentore</span>
                            </Link>
                            <button
                                onClick={handleLogin}
                                className='flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm text-blue-700 bg-blue-100 hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out'
                            >
                                {props?.loggedIn ? <MdSpaceDashboard /> : <RiLoginCircleLine />}
                                {props?.loggedIn ? 'Dashboard' : 'Login'}
                            </button>
                        </div>
                        <input type='search' placeholder='Search for domain, mentors...' className='w-full border-2 border-blue-700 rounded-lg px-4 mt-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300' value={searchBoxValue} onChange={handleSearch} autoFocus />
                    </div>
                </div>
                <hr className='w-full' />
            </header>
        </>
    )
}