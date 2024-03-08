import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function Header(props) {
    const navigate = useNavigate();
    const [searchBoxValue, setSearchBoxValue] = useState('');
    const clearId = useRef('');

    const handleLogin = () => {
        if (props?.loggedIn) {
            return navigate('/dashboard');
        }
        return navigate('/login');
    }

    useEffect(() => {
        if (props?.searchQuery) {
            setSearchBoxValue(props?.searchQuery);
        }
    }, [])

    const handleSearch = (e) => {
        clearTimeout(clearId.current);
        clearId.current = setTimeout(() => {
            navigate('/results?search_query=' + e.target.value);
        }, 500)
        setSearchBoxValue(e.target.value)
    }

    return (
        <>
            <div className='w-full'>
                <div className='flex flex-wrap justify-center items-center md:justify-between lg:justify-between lg:mx-16 md:mx-16 my-3'>
                    <Link to='/'><img src="../static/logo.png" className="h-8 mix-blend-multiply" alt="Mentore" /></Link>
                    <input type='search' placeholder='Search for domain, mentors...' className='lg:w-[40rem] md:w-[26rem] w-[16rem] border-2 border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300' value={searchBoxValue} onChange={handleSearch} autoFocus />
                    <button onClick={handleLogin} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3'>{props?.loggedIn ? 'Dashboard' : 'Login'}</button >
                </div>
            </div>
            <hr className='w-full' />
        </>
    )
}