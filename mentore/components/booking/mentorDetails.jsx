import React, { useState, useEffect } from 'react';
import { ErrorNotify } from '../global/toast';

export default function MentorDetails({ id, mentorDetails }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        const getMentorDetails = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            let mentors = await fetch(`https://mentore-ten.vercel.app/mentor/profile?id=${id}`, options);
            const result = await mentors.json();
            if (result.error) {
                ErrorNotify(result.error)
            } else {
                mentorDetails.current = result.result;
            }
            setLoading(false)
        }
        getMentorDetails();
    }, [])

    return (
        !loading && (
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
        )
    )
}