import React, { useState } from 'react';
import { DismissToast, ErrorNotify, Loading, SuccessNotify } from '../global/toast';


export default function BookingRequest({ mentorId, setDataLoading, mentorDetails }) {
    const [schedulingDetails, setSchedulingDetails] = useState({ startDateTime: '', duration: '', about: '' })
    const [scheduling, setScheduling] = useState(false)

    const handleSchedulingDetails = (e) => {
        setSchedulingDetails({ ...schedulingDetails, [e.target.id]: e.target.value })
    }

    const handleSchedule = async () => {
        if (schedulingDetails.startDateTime === '' || schedulingDetails.duration === '' || schedulingDetails.about === '') {
            ErrorNotify('Please fill all the fields')
            return;
        }
        if (parseInt(schedulingDetails.duration) > 3) {
            ErrorNotify('Duration should be less than 3 hours')
            return;
        }
        if (schedulingDetails.about.trim() === '') {
            ErrorNotify('Please fill about properly')
            return;
        }

        setScheduling(true)

        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ mentorId: mentorId, startDateTime: schedulingDetails.startDateTime, duration: schedulingDetails.duration, about: schedulingDetails.about })
        }
        const toastId = Loading('Scheduling the meeting');
        let schedule = await fetch('https://mentore-backend.vercel.app/meeting/schedule', options);
        const result = await schedule.json();
        DismissToast(toastId);
        if (result.error) {
            if (result.error === "Invalid JWT Token") {
                ErrorNotify("Please login to schedule a meeting")
            } else {
                ErrorNotify('Some error occured. Please try again')
            }
        } else {
            SuccessNotify("Meeting request sent successfully to mentor")
            location.reload();
        }
        setDataLoading(true)
        setScheduling(false)
        setSchedulingDetails({ startDateTime: '', duration: '', about: '' })
    }

    return (
        <div className='w-full mt-10'>
            <div className='bg-blue-50 rounded-lg shadow-lg p-6 mx-16'>
                <h2 className='text-2xl font-bold mb-4 text-blue-700'>Book a 1:1 meet here with {mentorDetails && mentorDetails.name}:</h2>
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
                    <button className='bg-blue-700 focus:ring-2 focus:ring-blue-500 text-white font-medium rounded-lg text-sm px-8 py-[0.4rem] w-full flex justify-center' disabled={scheduling} onClick={handleSchedule}>
                        {
                            scheduling ? (
                                <div className="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-blue-600" />
                            ) : (
                                'Schedule'
                            )
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}