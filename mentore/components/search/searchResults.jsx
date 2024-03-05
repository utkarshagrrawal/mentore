import React, { useState, useEffect, useRef } from 'react';
import MentorCard from './mentorCard';
import Paginate from '../global/paginate';
import Header from '../global/header';
import { ErrorNotify } from '../global/toast';

export default function SearchResults() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0); // Track current page
    const mentorsPerPage = 18; // Number of mentors per page
    const mentors = useRef([]);

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
    }, [])

    useEffect(() => {
        const getAllMentors = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            let mentorDetail = await fetch('http://localhost:3000/getallmentors', options)
            let result = await mentorDetail.json();
            if (result.error) {
                ErrorNotify(result.error)
            } else {
                mentors.current = result.result;
            }
            setDetailsLoading(false);
        }
        getAllMentors();
    }, [])

    // Pagination: Logic to slice mentors based on current page
    const indexOfLastMentor = (currentPage + 1) * mentorsPerPage;
    const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
    const currentMentors = mentors.current.slice(
        indexOfFirstMentor,
        indexOfLastMentor
    );

    // Pagination: Handle page change
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className='min-h-screen items-center flex flex-col w-full'>
            <Header loggedIn={loggedIn} />

            {/* Mentor Grid */}
            <div className='w-full my-10'>
                {!detailsLoading && (
                    <div className='grid lg:grid-cols-3 gap-2 md:grid-cols-2 grid-cols-1 place-content-center place-items-center drop-shadow-xl'>
                        {currentMentors.map((mentor, index) => <MentorCard key={index} mentor={mentor} />)}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!detailsLoading && <Paginate pages={Math.ceil(mentors.current.length / mentorsPerPage)} onChange={handlePageChange} />}
        </div>
    );
}