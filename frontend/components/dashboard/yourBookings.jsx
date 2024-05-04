import React, { useEffect, useRef, useState } from "react";
import { DismissToast, ErrorNotify, Loading, SuccessNotify } from "../global/toast";

const dateFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function YourBookings() {
    const [menteeMeetingsLoading, setMenteeMeetingsLoading] = useState(true);
    const menteeMeetings = useRef([]);

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await fetch('https://mentore-backend.vercel.app/user/my-bookings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            const result = await response.json();
            if (result.error) {
                ErrorNotify("Some error occured. Please try again")
            } else {
                menteeMeetings.current = result.result;
                setMenteeMeetingsLoading(false);
            }
        }
        fetchMeetings();
    }, [])

    const handlePay = async (id) => {
        const toastId = Loading('Processing payment...')
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                'title': 'Payment_for_mentor_session_for_' + id
            })
        }

        const pay = await fetch('https://mentore-backend.vercel.app/payment/pay/' + id, options);
        const response = await pay.json();

        DismissToast(toastId);

        if (response.error) {
            ErrorNotify(response.error);
        } else {
            const options = {
                "key": response.key_id,
                "amount": response.fees * 100,
                "currency": "INR",
                "name": "Mentore",
                "description": "Payment for mentor session",
                "image": "https://images.pexels.com/photos/6325962/pexels-photo-6325962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                "order_id": response.result.id,
                "handler": function (response) {
                    const paymentsuccess = async () => {
                        let options = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': localStorage.getItem('token'),
                            },
                        }
                        const payment = await fetch('https://mentore-backend.vercel.app/payment/success/' + id, options);
                        const response = await payment.json();

                        if (response.error) {
                            ErrorNotify(response.error);
                        } else {
                            SuccessNotify(response.result);
                            location.reload();
                        }
                    }
                    paymentsuccess();
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
                return ErrorNotify("Payment failed!")
            })
            rzp.open();
        }
    }

    const handleJoinMeeting = async (link) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                meeting_id: link
            })
        }
        const join = await fetch('https://mentore-backend.vercel.app/meeting/join/participant', options);
        const response = await join.json();
        if (response.error) {
            return ErrorNotify(response.error);
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
                            {!menteeMeetingsLoading && menteeMeetings.current.length > 0 ? menteeMeetings.current.map((item, id) => {
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
                                                <button disabled className='border-[0.1rem] bg-yellow-400 focus:ring-2 focus:ring-blue-500 font-medium rounded-lg text-sm py-1 w-full'>Pending</button>
                                            )}
                                            {(item.status === 'payment pending') && (
                                                <button onClick={() => handlePay(item.uniq_id)} className='bg-blue-700 focus:ring-2 focus:ring-blue-500 text-white font-medium rounded-lg text-sm py-1 w-full'>Pay</button>
                                            )}
                                            {(item.status === 'approved') && (
                                                <button disabled={(new Date() > new Date(item.end_time)) || (new Date() < new Date(item.start_time) ? 'true' : 'false')} onClick={() => handleJoinMeeting(item.meeting_link)} className='border-[0.1rem] border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm py-1 w-full'>
                                                    {((new Date() > new Date(item.end_time)) || (new Date() < new Date(item.start_time)) ? 'Waiting to start...' : 'Join')}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr className="text-center">
                                    <td colSpan='4' className="px-6 py-4 text-black">
                                        No bookings found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}