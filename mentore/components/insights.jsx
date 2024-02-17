import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'


export function Insights() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState({ blogsLoading: true });
    const allBlogs = useRef([])
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            };
            let users = await fetch("http://localhost:3000/getcurrentuser", options);
            const result = await users.json();
            if (result.error) {
                setLoggedIn(false);
                localStorage.removeItem("token");
                localStorage.removeItem("name");
                localStorage.removeItem("email");
            } else {
                setLoggedIn(true);
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        const getBlogs = async () => {
            setLoading({ ...loading, blogsLoading: true });
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            let blogs = await fetch("http://localhost:3000/getallblogs", options);
            const response = await blogs.json();
            if (response.error) {
                Swal.fire(
                    "Error",
                    "Some error occurred while fetching blogs",
                    "error"
                )
            } else {
                allBlogs.current = response.result;
                console.log(allBlogs.current)
            }
            setLoading({ ...loading, blogsLoading: false });
        }
        getBlogs();
    }, [])

    const handleLogButton = () => {
        if (loggedIn) {
            navigate("/profile");
        }
        navigate("/login");
    }

    return (
        <div className='min-h-screen items-center flex flex-col w-full'>
            <div className='w-full bg-[#d2d2d217]'>
                <div className='flex flex-wrap justify-center items-center md:justify-between lg:justify-between lg:mx-16 md:mx-16 my-3'>
                    <Link to='/'><img src="../static/logo.png" className="h-8 mix-blend-multiply" alt="Mentore" /></Link>
                    <input type='search' placeholder='Search for mentors' className='lg:w-[40rem] md:w-[26rem] w-[16rem] border-2 border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300' />
                    <button onClick={handleLogButton} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3'>{loggedIn ? 'Dashboard' : 'Login'}</button>
                </div>
            </div>
            <hr className='w-full' />
            <div className="w-full">
                <div className="flex w-full flex-wrap justify-center items-center mx-16 my-3">
                    <h1 className="text-4xl font-bold mr-16">Insights</h1>
                </div>
                <div className="flex w-full flex-wrap justify-center items-center my-3">
                    <div className="w-full mx-16 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        {!loading.blogsLoading && allBlogs.current.map((blog, index) => {
                            return (
                                <div key={index} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
                                    <Link to="/">
                                        <img className="rounded-t-lg" src="https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?cs=srgb&dl=pexels-pixabay-417173.jpg&fm=jpg" alt="" />
                                    </Link>
                                    <div className="p-5">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{blog.title}</h5>
                                        <Link to={'/blog/' + blog.id} target="_blank" className="inline-flex w-full items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                            View blog
                                        </Link>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}