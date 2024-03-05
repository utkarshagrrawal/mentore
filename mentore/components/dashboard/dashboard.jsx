import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../global/loader';


import BlogManagement from './blogManagement';
import WebinarManagement from './webinarManagement';
import Profile from './profile';
import DashboardHeader from '../global/dashboardHeader';
import MentorBookings from './mentorBookings';
import YourBookings from './yourBookings';
import { ErrorNotify } from '../global/toast';

export function Dashboard() {
    const user = useRef({});
    const [loading, setLoading] = useState(true);
    const [isMentor, setIsMentor] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            let users = await fetch('http://localhost:3000/getcurrentuser', options);
            let result = await users.json();
            if (result.error) {
                ErrorNotify(result.error)
                return navigate('/login');
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
        <>
            <DashboardHeader />

            <Profile user={user} isMentor={isMentor} />

            <YourBookings />

            {isMentor && <MentorBookings />}

            {isMentor && <WebinarManagement />}

            {isMentor && <BlogManagement />}
        </>
    )

    return (
        <div className='flex justify-center items-center flex-col'>
            {loading ? <Loader /> : dashboard}
        </div>
    )
}
