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
                    'Authorization': localStorage.getItem('token'),
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
                <div className='bg-[url("https://www.preplaced.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FProfileHeader.3d8c11fa.gif&w=1920&q=75")] bg-no-repeat bg-cover min-h-32 mx-16 rounded-t-lg mt-8'>
                </div>
                <div className='mx-16'>
                    <img src={mentorDetails.current && mentorDetails.current.male ? "https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/male-avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbWFsZS1hdmF0YXIucG5nIiwiaWF0IjoxNzExMTg4ODM3LCJleHAiOjE3NDI3MjQ4Mzd9.qExdt9gnnYndht7-boBf9JR7TXV4f5r87clKZAZx3ZI&t=2024-03-23T10%3A13%3A57.836Z" : "https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/female-avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvZmVtYWxlLWF2YXRhci5wbmciLCJpYXQiOjE3MTExODg4MDEsImV4cCI6MTc0MjcyNDgwMX0.SkW7zn8MTdTp2yQO3BousTpWQ3kBPQ2IT4wDLLKyamU&t=2024-03-23T10%3A13%3A21.412Z"} className='w-32 h-32 rounded-full absolute -mt-20 sm:ml-10 ml-4 border-4 border-white' alt='mentor' />
                </div>
                <div className='bg-gray-100 min-h-32 mx-16 rounded-b-lg py-4'>
                    <div className='pt-14 pl-6 flex items-center gap-2'>
                        <h3 className='text-2xl font-semibold'>{mentorDetails.current && mentorDetails.current.name}</h3>
                        <span>{mentorDetails.current && mentorDetails.current.male ? '(He/him)' : '(She/her)'}</span>
                    </div>
                    <h3 className='pt-1 pl-6 font-semibold'>{mentorDetails.current && mentorDetails.current.profession} at {mentorDetails.current && mentorDetails.current.company}</h3>
                    <h3 className='pt-1 pl-6'><span className='font-semibold'>Experience:</span> {mentorDetails.current && mentorDetails.current.experience} years</h3>
                    <div className='pt-1 pl-6 flex flex-col gap-2'>
                        <h3 className='font-semibold'>Skills:</h3>
                        <div className='flex flex-wrap gap-2'>
                            {
                                mentorDetails.current.skills && mentorDetails.current.skills.skills?.map((skill, index) => {
                                    return (
                                        <span
                                            key={index}
                                            className='bg-slate-300 font-medium text-black px-3 py-1 rounded-full text-sm'
                                        >
                                            {skill}
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div >
        )
    )
}