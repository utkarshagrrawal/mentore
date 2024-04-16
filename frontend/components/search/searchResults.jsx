import React, { useState, useEffect, useRef } from 'react';
import MentorCard from './mentorCard';
import Paginate from '../global/paginate';
import Header from '../global/header';
import { DismissToast, ErrorNotify, Loading, SuccessNotify } from '../global/toast';
import { useSearchParams } from "react-router-dom"

export function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search_query') || '');

    const [loggedIn, setLoggedIn] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0); // Track current page
    const mentorsPerPage = 18; // Number of mentors per page
    const [mentors, setMentors] = useState([]); // List of mentors

    useEffect(() => {
        const getUser = async () => {
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                },
            };
            let users = await fetch("https://mentore-backend.vercel.app//user/details", options);
            const result = await users.json();
            if (result.error) {
                localStorage.removeItem('token');
                setLoggedIn(false);
            } else {
                setLoggedIn(true);
            }
        };
        getUser();
    }, [])

    useEffect(() => {
        let controller = new AbortController();

        const findMentors = async () => {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem("token")
                },
                signal: controller.signal
            }

            let toastId;

            try {
                DismissToast(toastId);
                toastId = Loading("Searching for mentors");

                const response = await fetch("https://mentore-backend.vercel.app//search/" + searchQuery, options);
                const result = await response.json();

                DismissToast(toastId);

                if (result.Error) {
                    ErrorNotify("Some error occured. Please try again")
                } else {
                    if (JSON.parse(result.response).length > 0) {
                        SuccessNotify("Mentors found")
                        setMentors(JSON.parse(result.response))
                    } else {
                        const toastId = Loading("No mentors found. Searching for similar mentors");

                        let mentorDetail = await fetch('https://mentore-backend.vercel.app//mentor/all', options)
                        let result = await mentorDetail.json();

                        DismissToast(toastId);

                        if (result.error) {
                            ErrorNotify("Some error occured. Please try again")
                        } else {
                            let filteredPersons = result.result.filter((person) => {
                                if (person.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                                    return person.uniq_id;
                                }
                                return null;
                            })
                            setMentors(filteredPersons.map((person) => {
                                return result.result.find((mentor) => mentor.uniq_id === person.uniq_id)
                            }))
                            if (filteredPersons.length > 0) {
                                SuccessNotify("Similar mentors found")
                            } else {
                                ErrorNotify("No mentors found")
                            }
                        }
                    }
                }
            } catch (error) {

            }
        }

        if (searchQuery !== '') {
            findMentors();
        }

        return () => controller.abort();
    }, [searchQuery])

    useEffect(() => {
        const getAllMentors = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            }
            let mentorDetail = await fetch('https://mentore-backend.vercel.app//mentor/all', options)
            let result = await mentorDetail.json();
            if (result.error) {
                ErrorNotify("Some error occured. Please try again")
            } else {
                setMentors(result.result)
            }
            setDetailsLoading(false);
        }
        getAllMentors();
    }, [])

    // Pagination: Logic to slice mentors based on current page
    const indexOfLastMentor = (currentPage + 1) * mentorsPerPage;
    const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
    const currentMentors = mentors && mentors.length > 0 && mentors.slice(
        indexOfFirstMentor,
        indexOfLastMentor
    );

    // Pagination: Handle page change
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <div className='min-h-screen items-center flex flex-col w-full'>
            <Header loggedIn={loggedIn} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* Mentor Grid */}
            <div className='w-full my-10'>
                {!detailsLoading && (
                    <div className='grid lg:grid-cols-3 gap-2 md:grid-cols-2 grid-cols-1 place-content-center place-items-center drop-shadow-xl'>
                        {currentMentors && currentMentors.length > 0 && currentMentors.map((mentor, index) => <MentorCard key={index} mentor={mentor} />)}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!detailsLoading && <Paginate pages={mentors ? Math.ceil(mentors.length / mentorsPerPage) : 1} onChange={handlePageChange} />}
        </div>
    );
}