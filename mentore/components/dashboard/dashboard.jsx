import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../global/loader';


import BlogManagement from './blogManagement';
import WebinarManagement from './webinarManagement';
import Profile from './profile';
import DashboardHeader from '../global/dashboardHeader';
import MentorBookings from './mentorBookings';
import YourBookings from './yourBookings';
import NewWebinar from './newWebinar';
import NewBlog from './newBlog';

export function Dashboard() {
    const user = useRef({});
    const [loading, setLoading] = useState(true);
    const [isMentor, setIsMentor] = useState(false);
    const [webinarDetailsLoading, setWebinarDetailsLoading] = useState(true);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                },
            }
            let users = await fetch('https://mentore-ten.vercel.app/user/details', options);
            let result = await users.json();
            if (result.error) {
                localStorage.removeItem('token');
                navigate('/user/login');
                return;
            } else {
                user.current = result.result;
                if (user.current.type === 'mentor') {
                    setIsMentor(true);
                }
            }
            setLoading(false);
        }
        getUser();
    }, [])

    const dashboard = (
        <div className='mb-10'>
            <DashboardHeader />

            <Profile user={user} isMentor={isMentor} />

            {
                isMentor && (
                    <>
                        <NewWebinar setWebinarDetailsLoading={setWebinarDetailsLoading} />

                        <NewBlog setBlogsLoading={setBlogsLoading} />
                    </>
                )
            }

            <YourBookings />

            {isMentor && <MentorBookings />}

            {isMentor && <WebinarManagement webinarDetailsLoading={webinarDetailsLoading} setWebinarDetailsLoading={setWebinarDetailsLoading} />}

            {isMentor && <BlogManagement blogsLoading={blogsLoading} setBlogsLoading={setBlogsLoading} />}
        </div>
    )

    return (
        <div className='flex justify-center items-center flex-col'>
            {loading ? <Loader /> : dashboard}
        </div>
    )
}
