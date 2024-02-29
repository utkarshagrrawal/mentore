import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

export function LiveWebinars() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState({ loading: true, webinarsLoading: true });
    const allWebinars = useRef([])
    const navigate = useNavigate();

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
        const webinars = async () => {
            setLoading({ ...loading, webinarsLoading: true });
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            let webinars = await fetch("http://localhost:3000/allwebinars", options);
            const result = await webinars.json();
            if (result.error) {
                Swal.fire(
                    "Error",
                    "Some error occurred while fetching webinars",
                    "error"
                )
            } else {
                allWebinars.current = result.success;
                setLoading({ ...loading, webinarsLoading: false });
            }
        }
        webinars();
    }, [])

    const handleLogButton = () => {
        if (loggedIn) {
            navigate("/profile");
        } else {
            navigate("/login");
        }
    }

    const handleJoinWebinar = async (meeting_id) => {
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "meeting_id": meeting_id
            })
        };
        let webinars = await fetch('http://localhost:3000/joinwebinarparticipant', options);
        const result = await webinars.json();
        if (!result.success) {
            Swal.fire(
                "Error",
                "Some error occurred while joining webinar",
                "error"
            )
        } else {
            location.href = result.success;
        }
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
                <div className="flex w-full flex-wrap justify-center items-center mx-16 mt-3 mb-14">
                    <h1 className="text-4xl font-bold mr-16">Live webinars</h1>
                </div>
                <div className="flex w-full flex-wrap justify-center items-center my-3">
                    <div className="w-full mx-16 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        {!loading.webinarsLoading && allWebinars.current.map((webinar, index) => {
                            if (new Date().toISOString() < new Date(webinar.end_time).toISOString()) {
                                return (
                                    <div key={index} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-2xl duration-300 relative">
                                        {new Date(webinar.start_time).toISOString() < new Date().toISOString() && (
                                            <div className="absolute right-0">
                                                <div class="inline-block relative px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-r-sm rounded-l-lg">
                                                    Live
                                                    <span class="absolute top-1 right-1 w-2 h-2 bg-white rounded-full shadow-md animate-ping"></span>
                                                </div>
                                            </div>
                                        )}
                                        <Link to="/">
                                            <img className="rounded-t-lg" src="https://static.vecteezy.com/system/resources/previews/029/694/959/original/course-learning-mentor-tutor-webinar-icon-web-education-technology-program-in-virtual-online-learning-class-conference-or-tutorial-training-app-illustration-design-on-white-background-eps10-vector.jpg" alt="" />
                                        </Link>
                                        <div className="p-5">
                                            <Link to="/">
                                                <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">{webinar.title}</h5>
                                            </Link>
                                            <div className="flex items-center text-gray-600 text-sm mb-3">
                                                <span className="font-semibold text-lg">{'By: ' + webinar.mentor_name}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600 text-md mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                <span>{'From: ' + new Date(webinar.start_time).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600 text-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                <span>{'Till: ' + new Date(webinar.end_time).toLocaleString()}</span>
                                            </div>
                                            <button disabled={new Date(webinar.start_time).toISOString() < new Date().toISOString() ? false : true} onClick={() => handleJoinWebinar(webinar.meeting_link)} target="_blank" className={new Date(webinar.start_time).toISOString() < new Date().toISOString() ? "inline-flex mt-4 w-full items-center px-3 py-2 text-sm font-medium border border-blue-700 duration-200 hover:text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" : "inline-flex mt-4 w-full items-center px-3 py-2 text-sm font-medium border border-yellow-700 bg-[#fdc113] duration-200 rounded-lg"}>
                                                {new Date(webinar.start_time).toISOString() < new Date().toISOString() ? 'Join webinar' : 'Webinar not started yet'}
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
