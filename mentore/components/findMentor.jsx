import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';

export function FindMentor() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [isMentor, setIsMentor] = useState(false);
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
                    'Authorization': localStorage.getItem('token')
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
                console.log(result)
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
            <div className='w-full bg-[#d2d2d217] mb-10'>
                <div className='flex flex-wrap justify-center items-center md:justify-between lg:justify-between mx-16 my-3'>
                    <Link to='/'><img src="../static/logo.png" className="h-8 mix-blend-multiply" alt="Mentore" /></Link>
                    <input type='search' placeholder='Search for mentors' className='lg:w-[40rem] md:w-[26rem] w-[16rem] border-2 border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300' />
                    <button onClick={handleLogButton} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3'>{loggedIn ? 'Dashboard' : 'Login'}</button>
                </div>
            </div>

            {/* Mentor Grid */}
            <div className='w-full mb-8'>
                {!detailsLoading && (
                    <div className='grid lg:grid-cols-3  md:grid-cols-2 grid-cols-1'>
                        {currentMentors.map((mentor, index) => (
                            <div
                                key={index}
                                className='max-w-sm mx-16 px-4 pt-8 pb-3 bg-gray-100 mb-8 border border-gray-200 rounded-2xl shadow'
                            >
                                <img
                                    className='rounded-t-lg h-48 object-contain w-full'
                                    src={
                                        mentor && mentor.male
                                            ? '../static/male-avatar.png'
                                            : '../static/female-avatar.png'
                                    }
                                    alt=''
                                />
                                <div className='p-5'>
                                    <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 text-center'>
                                        {mentor && mentor.name}
                                    </h5>
                                    <p className='font-normal text-gray-700 dark:text-gray-400 text-center'>
                                        {mentor && mentor.profession}
                                    </p>
                                    <p className='font-normal text-gray-700 dark:text-gray-400 text-center'>
                                        {' '}
                                        {mentor && mentor.company}
                                    </p>
                                    <p className='font-normal text-gray-700 dark:text-gray-400 text-center'>
                                        Experience: {mentor.experience} years
                                    </p>
                                    <Link
                                        to={`/mentor/${mentor.email}`}
                                        className='flex justify-center w-full items-center mt-8 px-3 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
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
                <div className="flex justify-center items-center w-3/4">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="Next"
                        previousLabel="Previous"
                        pageCount={Math.ceil(mentors.current.length / mentorsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName="pagination flex justify-evenly items-center"
                        activeClassName="active"
                        previousLinkClassName="bg-gray-200 px-3 py-2 rounded-lg mr-2"
                        nextLinkClassName="bg-gray-200 px-3 py-2 rounded-lg ml-2"
                        pageClassName="px-3 py-2 rounded-lg mb-2 bg-gray-200 "
                        pageLinkClassName="hover:bg-gray-300  "
                    />
                </div>

            )}
        </div>
    );
}
