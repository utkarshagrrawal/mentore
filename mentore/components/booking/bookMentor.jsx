import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '../global/loader';
import Header from '../global/header';
import MentorDetails from './mentorDetails';
import BookingRequest from './bookingRequest';
import BookingsTable from './bookingsTable';

export function BookMentor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true)
    const [dataLoading, setDataLoading] = useState(true)
    const mentorDetails = useRef([]);

    useEffect(() => {
        setLoading(true)
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
                navigate('/login')
            } else {
                setLoggedIn(true);
            }
            setLoading(false)
        };
        getUser();
    }, []);

    const mentorCode = (
        <>
            <Header loggedIn={loggedIn} />

            <MentorDetails id={id} mentorDetails={mentorDetails} />

            <BookingRequest mentorId={id} mentorDetails={mentorDetails} setDataLoading={setDataLoading} />

            <BookingsTable dataLoading={dataLoading} setDataLoading={setDataLoading} id={id} />
        </>
    )

    return (
        <div className='w-full min-h-screen flex items-center flex-col'>
            {loading ? <Loader /> : mentorCode}
        </div>
    )
}
