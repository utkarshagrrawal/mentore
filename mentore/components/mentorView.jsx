import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loader } from './loader';
import Swal from 'sweetalert2';
import { RAZORPAY_KEY_ID } from '../src/assets/credentials';

export function MentorView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true)
    const [dataLoading, setDataLoading] = useState(true)
    const [schedulingDetails, setSchedulingDetails] = useState({ startDateTime: '', duration: '', about: '' })
    const meetings = useRef([]);
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

    useEffect(() => {
        setLoading(true)
        const getMentorDetails = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            let mentors = await fetch(`http://localhost:3000/getmentorprofile?id=${id}`, options);
            const result = await mentors.json();
            if (result.error) {
                Swal.fire(
                    'Error',
                    result.error,
                    'error'
                )
            } else {
                mentorDetails.current = result.result;
            }
            setLoading(false)
        }
        getMentorDetails();
    }, [])

    const handleLoginButton = () => {
        if (loggedIn) {
            navigate('/profile')
        } else {
            navigate('/login')
        }
    }

    useEffect(() => {
        setDataLoading(true)

        let options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const getAllMeetings = async () => {
            const allMeetings = await fetch('http://localhost:3000/getwithmentormeetings/' + id + '/', options)
            const response = await allMeetings.json();

            if (response.error) {
                Swal.fire(
                    'Oops',
                    response.error,
                    'error'
                )
            } else {
                meetings.current = response.result;
            }
            setDataLoading(false)
        }

        getAllMeetings();
    }, [])

    const handleSchedulingDetails = (e) => {
        setSchedulingDetails({ ...schedulingDetails, [e.target.id]: e.target.value })
    }

    const handleSchedule = async () => {
        if (schedulingDetails.startDateTime === '' || schedulingDetails.duration === '' || schedulingDetails.about === '') {
            Swal.fire(
                'Error',
                'Please fill all the fields',
                'error'
            )
            return;
        }
        if (parseInt(schedulingDetails.duration) > 3) {
            Swal.fire(
                'Error',
                'Duration should be less than 3 hours',
                'error'
            )
            return;
        }
        if (schedulingDetails.about.trim() === '') {
            Swal.fire(
                'Error',
                'Please fill all the fields',
                'error'
            )
            return;
        }

        setLoading(true)

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mentorId: id, startDateTime: schedulingDetails.startDateTime, duration: schedulingDetails.duration, about: schedulingDetails.about })
        }
        let schedule = await fetch('http://localhost:3000/schedulemeet', options);
        const result = await schedule.json();
        if (result.error) {
            Swal.fire(
                'Error',
                result.error,
                'error'
            )
        } else {
            Swal.fire(
                'Success',
                result.result,
                'success'
            )
        }
        setLoading(false)
    }

    const getMeetingStatus = (item) => {
        if (item.status === 'pending') {
            return 'Pending'
        } else if (item.status === 'approved') {
            return 'Approved'
        } else if (item.status === 'payment pending') {
            return 'Payment pending'
        } else {
            return 'Rejected'
        }
    }

    const handlePay = async (id) => {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const pay = await fetch('http://localhost:3000/pay/' + id, options);
        const response = await pay.json();

        if (response.error) {
            Swal.fire(
                'Error',
                response.error,
                'error'
            )
        } else {
            const options = {
                "key": RAZORPAY_KEY_ID,
                "amount": 15000,
                "currency": "INR",
                "name": "Mentore",
                "description": "Payment for mentor session",
                "image": "https://images.pexels.com/photos/6325962/pexels-photo-6325962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                "order_id": response.result.id,
                "handler": async function (response) {
                    const paymentsuccess = async () => {
                        let options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                        const payment = await fetch('http://localhost:3000/paymentsuccess/' + id, options);
                        const response = await payment.json();

                        if (response.error) {
                            Swal.fire(
                                'Error',
                                response.error,
                                'error'
                            )
                        } else {
                            Swal.fire(
                                'Success',
                                response.result,
                                'success'
                            )
                            location.reload();
                        }
                    }
                    await paymentsuccess();
                },
                "notes": {
                    "address": "Mentore corporate office"
                },
                "theme": {
                    "color": "#2463eb"
                }
            }
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                return Swal.fire(
                    'Error',
                    'Payment failed',
                    'error'
                )
            })
            rzp.open();
        }
    }

    const mentorCode = (
        <>
            <div className='w-full bg-[#d2d2d217]'>
                <div className='flex flex-wrap justify-center items-center md:justify-between lg:justify-between mx-16 my-3'>
                    <Link to='/'><img src="../static/logo.png" className="h-8 mix-blend-multiply" alt="Mentore" /></Link>
                    <input type='search' placeholder='Search for mentors' className='lg:w-[40rem] md:w-[26rem] w-[16rem] border-2 border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300' />
                    <button onClick={handleLoginButton} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3'>{loggedIn ? 'Dashboard' : 'Login'}</button>
                </div>
            </div>
            <hr className='w-full' />
            <div className='w-full drop-shadow-xl'>
                <div className='bg-gradient-to-r from-blue-300 to-blue-300 min-h-32 mx-16 rounded-t-lg mt-8'>
                </div>
                <div className='mx-16'>
                    <img src={mentorDetails.current && mentorDetails.current.male ? "../static/male-avatar.png" : "../static/female-avatar.png"} className='w-32 h-32 rounded-full absolute -mt-20 sm:ml-10 ml-4 border-4 border-white' alt='mentor' />
                </div>
                <div className='bg-gray-100 min-h-32 mx-16 rounded-b-lg py-4'>
                    <div className='pt-14 pl-6 flex items-center gap-2'>
                        <h3 className='text-2xl font-semibold'>{mentorDetails.current && mentorDetails.current.name}</h3><span className='text'>{mentorDetails.current && mentorDetails.current.male ? '(He/him)' : '(She/her)'}</span>
                    </div>
                    <div className='pt-1 pl-6 flex items-center gap-2'>
                        <h3>{mentorDetails.current && mentorDetails.current.profession} at {mentorDetails.current && mentorDetails.current.company}</h3>
                    </div>
                    <div className='pt-1 pl-6 flex items-center gap-2'>
                        <h3>Experience: {mentorDetails.current && mentorDetails.current.experience} years</h3>
                    </div>
                </div>
            </div>
            <div className='w-full mt-10'>
                <div className='bg-blue-50 rounded-lg shadow-lg p-6 mx-16'>
                    <h2 className='text-2xl font-bold mb-4 text-blue-700'>Book a 1:1 meet here with {mentorDetails.current && mentorDetails.current.name}:</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex flex-col'>
                            <label htmlFor='date' className='font-semibold'>Date and time</label>
                            <input id='startDateTime' name='startDateTime' value={schedulingDetails.startDateTime} type='datetime-local' onChange={handleSchedulingDetails} className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor='duration' className='font-semibold'>Duration (Less than 3 hours)</label>
                            <input id='duration' name='duration' value={parseInt(schedulingDetails.duration || 0)} type='number' min={0} onChange={handleSchedulingDetails} placeholder='in hours' className='border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500' />
                        </div>
                    </div>
                    <div className='mt-4'>
                        <label htmlFor='about' className='font-semibold'>About</label>
                        <textarea id='about' name='about' value={schedulingDetails.about} onChange={handleSchedulingDetails} placeholder='Please specify the reason in brief for this session requirement' className='border rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'></textarea>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <button className='border-[0.1rem] border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm px-8 py-3 w-full' onClick={handleSchedule}>Schedule</button>
                    </div>
                </div>
            </div>
            <div className='w-full my-10'>
                <div className='bg-blue-50 rounded-lg shadow-lg p-6 mx-16'>
                    <h1 className='text-center text-3xl font-bold text-black'>Current bookings</h1>
                    <div className='relative overflow-x-auto mt-4 border-[0.1rem] border-black sm:rounded-lg'>
                        <table className="w-full text-sm text-left rtl:text-right text-blue-100 table-fixed">
                            <thead className="text-xs text-white bg-blue-600">
                                <tr className='text-center uppercase'>
                                    <th scope="col" className="px-6 py-3">
                                        Start time
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        End time
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Status
                                    </th>
                                    <th scope="col" className='px-6 my-3'>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {meetings.current && meetings.current.map(item => {
                                    return (
                                        <tr key={item.uniq_id} className='text-center text-black'>
                                            <td scope="row" className='px-6 py-3'>
                                                {new Date(item.start_time).toLocaleDateString() + ' ' + new Date(item.start_time).toLocaleTimeString()}
                                            </td>
                                            <td scope="row" className='px-6 py-3'>
                                                {new Date(item.end_time).toLocaleDateString() + ' ' + new Date(item.end_time).toLocaleTimeString()}
                                            </td>
                                            <td scope="row" className='px-6 py-3'>
                                                {getMeetingStatus(item)}
                                            </td>
                                            <td scope="row" className='px-6 py-3'>
                                                {(item.status === 'payment pending') && (
                                                    <button onClick={() => handlePay(item.uniq_id)} className='border-[0.1rem] border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm px-8 py-1 w-full'>Pay</button>
                                                )}
                                                {(item.status === 'pending') && (
                                                    <button disabled className='border-[0.1rem] bg-[#fdc113] focus:ring-2 focus:ring-blue-500 font-medium rounded-lg text-sm px-8 py-1 w-full'>Pending</button>
                                                )}
                                                {(item.status === 'approved') && (
                                                    <Link to="" className='border-[0.1rem] border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm px-8 py-1 w-full'>Join</Link>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <div className='w-full min-h-screen flex items-center flex-col'>
            {loading ? <Loader /> : mentorCode}
        </div>
    )
}
