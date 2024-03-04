import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Loader } from '../global/loader';

import BookingsManagement, { MeetingsManagement } from './meetingsManagement';
import BlogManagement from './blogManagement';
import WebinarManagement from './webinarManagement';
import Profile from './profile';
import DashboardHeader from '../global/dashboardHeader';

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
                Swal.fire(
                    'Error',
                    result.error,
                    'error'
                )
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

            <BookingsManagement />

            {isMentor && <MeetingsManagement />}

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
