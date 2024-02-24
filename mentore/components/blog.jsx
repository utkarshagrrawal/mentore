import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import parse from 'html-react-parser';

export function Blog() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState({ loading: true, blogLoading: true });
    const blog = useRef({});
    const { id } = useParams();
    const navigate = useNavigate();

    // checks if the user is logged in
    useEffect(() => {
        const getUser = async () => {
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            let users = await fetch("http://localhost:3000/getcurrentuser", options);
            const result = await users.json();
            if (result.error) {
                setLoggedIn(false);
            } else {
                setLoggedIn(true);
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        setLoading({ ...loading, blogLoading: true })
        const getBlog = async () => {
            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "blogID": id
                })
            };
            let users = await fetch("http://localhost:3000/getcurrentblog", options);
            const result = await users.json();
            if (result.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: result.error
                })
            } else {
                blog.current = result.result;
            }
            setLoading({ ...loading, blogLoading: false });
        };
        getBlog();
    }, [])

    const handleLogButton = () => {
        if (loggedIn) {
            return navigate('/profile')
        }
        navigate('/login')
    }

    return (
        <>
            <div className='w-full bg-[#d2d2d217]'>
                <div className='flex flex-wrap justify-center items-center md:justify-between lg:justify-between lg:mx-16 md:mx-16 my-3'>
                    <Link to='/'><img src="../static/logo.png" className="h-8 mix-blend-multiply" alt="Mentore" /></Link>
                    <input type='search' placeholder='Search for mentors' className='lg:w-[40rem] md:w-[26rem] w-[16rem] border-2 border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300' />
                    <button onClick={handleLogButton} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3'>{loggedIn ? 'Dashboard' : 'Login'}</button>
                </div>
            </div>
            <hr className='w-full' />
            {!loading.blogLoading ? (
                <div className="w-full min-h-screen flex flex-col items-center px-14">
                    <h1 className="text-4xl font-semibold my-8">{blog.current.title}</h1>
                    <div className="w-full">
                        {parse(blog.current.content)}
                    </div>
                </div>
            ) : null}
        </>
    )
}