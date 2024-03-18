import React, { useEffect, useRef, useState } from "react";
import { ErrorNotify, SuccessNotify } from "../global/toast";

const dateFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function MentorBookings() {
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
            const response = await fetch('http://localhost:3000/mentor/meetings', options);
            const result = await response.json();
            if (result.error) {
                ErrorNotify(result.error)
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
        const approveRequest = await fetch('http://localhost:3000/mentor/meeting/approve?id=' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const response = await approveRequest.json();
        if (response.error) {
            ErrorNotify(response.error)
        } else {
            SuccessNotify(response.result)
        }
        setMeetingsLoading(true);
        return;
    }

    const handleReject = async (id) => {
        const rejectRequest = await fetch('http://localhost:3000/mentor/meeting/reject?id=' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const response = await rejectRequest.json();
        if (response.error) {
            ErrorNotify(response.error)
        } else {
            SuccessNotify("Meeting rejected successfully!")
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
        const response = await fetch('http://localhost:3000/meeting/join/host', options);
        const result = await response.json();

        if (result.error) {
            return ErrorNotify(result.error);
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
                        <thead className="text-xs text-slate-600 uppercase bg-blue-100">
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
                            {!meetingsLoading && meetings.current && meetings.current.length > 0 ? meetings.current.map((item) => {
                                return (
                                    <tr key={item.uniq_id} className="text-center">
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
                                                    <button onClick={() => handleApprove(item.uniq_id)} className='border border-green-500 duration-150 hover:bg-green-700 focus:ring-2 focus:ring-green-500 hover:text-white font-medium rounded-lg text-sm py-1'>
                                                        Accept
                                                    </button>
                                                    <button onClick={() => handleReject(item.uniq_id)} className='border border-red-500 duration-150 hover:bg-red-700 focus:ring-2 focus:ring-red-500 hover:text-white font-medium rounded-lg text-sm py-1'>
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
                            }) : (
                                <tr className="text-center">
                                    <td className="px-6 py-4 text-black" colSpan='4'>
                                        No meetings
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