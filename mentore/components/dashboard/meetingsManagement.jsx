import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { RAZORPAY_KEY_ID } from "../../src/assets/credentials";

const dateFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function BookingsManagement() {
    const [menteeMeetingsLoading, setMenteeMeetingsLoading] = useState(true);
    const menteeMeetings = useRef([]);

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await fetch('http://localhost:3000/allmenteemeetings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const result = await response.json();
            if (result.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.error
                })
            } else {
                menteeMeetings.current = result.result;
                setMenteeMeetingsLoading(false);
            }
        }
        fetchMeetings();
    }, [])

    const handlePay = async (id) => {
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'title': 'Payment_for_mentor_session_for_' + id,
            })
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

    const handleJoinMeeting = async (link) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                meeting_id: link
            })
        }
        const join = await fetch('http://localhost:3000/joinmeetingparticipant', options);
        const response = await join.json();
        if (response.error) {
            Swal.fire(
                'Error',
                response.error,
                'error'
            )
        } else {
            return window.open(response.success, '_blank');
        }
    }

    return (
        <>
            <h1 className='text-center text-3xl font-bold my-4'>Your bookings</h1>
            <div className='w-full'>
                <div className="relative overflow-x-auto mx-14 shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-blue-100 table-fixed">
                        <thead className="text-xs text-white uppercase bg-blue-600">
                            <tr className='text-center'>
                                <th scope="col" className="px-6 py-3">
                                    Applied on
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Mentor name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    About
                                </th>
                                <th scope="col" className='px-6 my-3'>
                                    Link
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!menteeMeetingsLoading && menteeMeetings.current.map((item, id) => {
                                return (
                                    <tr key={id} className="border-b border-blue-400 text-center">
                                        <td className="px-6 py-4 text-black">
                                            {dateFormatter.format(new Date(item.start_time))}
                                        </td>
                                        <td className="px-6 py-4 text-black">
                                            {item.mentor_name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-black whitespace-pre-line">
                                            {item.about}
                                        </td>
                                        <td className="px-6 py-4 text-black">
                                            {(item.status === 'pending') && (
                                                <button disabled className='border-[0.1rem] bg-[#fdc113] focus:ring-2 focus:ring-blue-500 font-medium rounded-lg text-sm px-8 py-1 w-full'>Pending</button>
                                            )}
                                            {(item.status === 'payment pending') && (
                                                <button onClick={() => handlePay(item.uniq_id)} className='border-[0.1rem] border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm px-8 py-1 w-full'>Pay</button>
                                            )}
                                            {(item.status === 'approved') && (
                                                <button disabled={(new Date() > new Date(item.end_time)) || (new Date() < new Date(item.start_time) ? 'true' : 'false')} onClick={() => handleJoinMeeting(item.meeting_link)} className='border-[0.1rem] border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm px-8 py-1 w-full'>
                                                    {((new Date() > new Date(item.end_time)) || (new Date() < new Date(item.start_time)) ? 'Waiting to start...' : 'Join')}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}


export function MeetingsManagement() {
    const [meetingsLoading, setMeetingsLoading] = useState(true);
    const meetings = useRef([]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }

        const getMeetings = async () => {
            const response = await fetch('http://localhost:3000/getmentorallmeetings', options);
            const result = await response.json();
            if (result.error) {
                Swal.fire(
                    'Error',
                    result.error,
                    'error'
                )
            } else {
                meetings.current = result.result;
            }
            setMeetingsLoading(false);
        }
        if (meetingsLoading) {
            getMeetings()
        }
    }, [meetingsLoading])

    const handleApprove = async (id) => {
        const approveRequest = await fetch('http://localhost:3000/approvemeetings?id=' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const response = await approveRequest.json();
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
        }
        setMeetingsLoading(true);
        return;
    }

    const handleReject = async (id) => {
        const rejectRequest = await fetch('http://localhost:3000/rejectmeetings?id=' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const response = await rejectRequest.json();
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
        }
        setMeetingsLoading(true);
        return;
    }

    const handleJoinMeeting = async (link) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                meeting_id: link
            })
        }
        const response = await fetch('http://localhost:3000/joinmeetinghost', options);
        const result = await response.json();

        if (result.error) {
            Swal.fire(
                'Error',
                result.error,
                'error'
            )
        } else {
            return window.open(result.success, '_blank');
        }
    }

    return (
        <>
            <h1 className='text-center text-3xl font-bold my-4 mt-8'>Schedule meetings</h1>
            <div className='w-full mb-8'>
                <div className="relative overflow-x-auto mx-14 shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-blue-100 table-fixed">
                        <thead className="text-xs text-white uppercase bg-blue-600">
                            <tr className='text-center'>
                                <th scope="col" className="px-6 py-3">
                                    Start time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    End time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    About
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!meetingsLoading && meetings.current && meetings.current.map((item) => {
                                return (
                                    <tr key={item.uniq_id} className="border-b border-blue-400 text-center">
                                        <th scope="row" className="px-6 py-4 font-medium text-black whitespace-pre-line">
                                            {dateFormatter.format(new Date(item.start_time))}
                                        </th>
                                        <td className="px-6 py-4 text-black">
                                            {dateFormatter.format(new Date(item.end_time))}
                                        </td>
                                        <td className="px-6 py-4 text-black">
                                            {item.about || 'No description'}
                                        </td>
                                        <td className="px-6 py-4 text-black">
                                            {item.status === 'payment pending' ? (
                                                <button disabled className='border-[0.1rem] bg-[#fdc113] focus:ring-2 focus:ring-blue-500 font-medium rounded-lg text-sm px-8 py-1 w-full'>
                                                    Payment pending
                                                </button>
                                            ) : item.status === 'pending' ? (
                                                <div className='grid grid-cols-2 gap-2'>
                                                    <button onClick={() => handleApprove(item.uniq_id)} className='border border-green-500 duration-150 hover:bg-green-700 focus:ring-2 focus:ring-green-500 hover:text-white font-medium rounded-lg text-sm px-6 py-1'>
                                                        Accept
                                                    </button>
                                                    <button onClick={() => handleReject(item.uniq_id)} className='border border-red-500 duration-150 hover:bg-red-700 focus:ring-2 focus:ring-red-500 hover:text-white font-medium rounded-lg text-sm px-6 py-1'>
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => handleJoinMeeting(item.meeting_link)} className='border-[0.1rem] border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm px-8 py-1 w-full' disabled={(new Date() > new Date(item.end_time)) || (new Date() < new Date(item.start_time) ? 'true' : 'false')}>
                                                    {((new Date() > new Date(item.end_time)) || (new Date() < new Date(item.start_time)) ? 'Waiting to start...' : 'Join')}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}