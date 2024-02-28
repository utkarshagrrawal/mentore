import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import '../styles/pagination.css';

export function FindMentor() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0); // Track current page
    const mentorsPerPage = 18; // Number of mentors per page
    const mentors = useRef([]);

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
    }, [])

    // handles the search bar
    const handleSearch = (e) => {
        e.preventDefault();
    }

    // handles the navbar top right button
    const handleLogButton = () => {
        if (loggedIn) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    }

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
                Swal.fire(
                    'Error',
                    result.error,
                    'error'
                )
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
            <div className='w-full bg-[#d2d2d217]'>
                <div className='flex flex-wrap justify-center items-center md:justify-between lg:justify-between mx-16 my-3'>
                    <Link to='/'><img src="../static/logo.png" className="h-8 mix-blend-multiply" alt="Mentore" /></Link>
                    <input type='search' placeholder='Search for mentors' className='lg:w-[40rem] md:w-[26rem] w-[16rem] border-2 border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300' />
                    <button onClick={handleLogButton} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3'>{loggedIn ? 'Dashboard' : 'Login'}</button>
                </div>
            </div>
            <hr className='w-full'></hr>

            {/* Mentor Grid */}
            <div className='w-full my-10'>
                {!detailsLoading && (
                    <div className='grid lg:grid-cols-3 gap-2 md:grid-cols-2 grid-cols-1 place-content-center place-items-center drop-shadow-xl'>
                        {currentMentors.map((mentor, index) => (
                            <div
                                key={index}
                                className='max-w-sm w-full mx-16 px-4 pt-8 pb-8 bg-gray-100 mb-8 border border-gray-200 rounded-2xl shadow'
                            >
                                <img
                                    className='rounded-t-lg h-48 object-contain w-full mix-blend-multiply'
                                    src={
                                        mentor && mentor.male
                                            ? '../static/male-avatar.png'
                                            : '../static/female-avatar.png'
                                    }
                                    alt=''
                                />
                                <div className='p-5 relative min-h-[15rem]'>
                                    <h5 className='mb-2 text-2xl mb-4 font-bold tracking-tight text-gray-900 text-center'>
                                        {mentor && mentor.name}
                                    </h5>
                                    <p className='font-normal text-gray-700 text-center font-semibold'>
                                        {mentor && mentor.profession}
                                    </p>
                                    <p className='font-normal text-gray-700 text-center'>
                                        {' '}
                                        {mentor && mentor.company}
                                    </p>
                                    <p className='font-normal text-gray-700 text-center'>
                                        Experience: {mentor.experience} years
                                    </p>
                                    <Link
                                        to={`/mentor/${mentor.uniq_id}`}
                                        className='flex justify-center w-[19.1rem] items-center bottom-0 absolute px-3 py-2 text-sm font-medium hover:text-white border-[0.1rem] border-black hover:duration-150 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
                                    >
                                        View details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!detailsLoading && (
                <div className="flex justify-center items-center w-3/4 mb-8">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="Next"
                        previousLabel="Previous"
                        pageCount={Math.ceil(mentors.current.length / mentorsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageChange}
                        containerClassName="pagination flex justify-center items-center space-x-2"
                        activeClassName="bg-blue-500 text-white"
                        previousLinkClassName="px-4 py-2 rounded-lg h-full bg-gray-200 hover:bg-gray-300 flex items-center"
                        nextLinkClassName="px-4 py-2 rounded-lg h-full bg-gray-200 hover:bg-gray-300 flex items-center"
                        pageClassName="px-3 py-2 rounded-lg"
                        pageLinkClassName="hover:bg-blue-300"
                    />
                </div>

            )}
        </div>
    );
}
