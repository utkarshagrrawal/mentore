import React, { useEffect, useRef, useState } from "react";
import { ErrorNotify } from "../global/toast";


export default function MentorProfile() {
    const [mentorDetails, setMentorDetails] = useState({});
    const allSkills = useRef([]);
    const [skillsLoading, setSkillsLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(true);

    useEffect(() => {
        const getSkills = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }
            let skills = await fetch('https://mentore-ten.vercel.app/mentor/skill-options', options)
            let result = await skills.json();
            if (result.error) {
                ErrorNotify(result.error)
            } else {
                allSkills.current = result.result;
            }
            setSkillsLoading(false);
        }
        getSkills();
    }, [])

    useEffect(() => {
        const getMentorDetails = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }
            let mentorDetailsResponse = await fetch('https://mentore-ten.vercel.app/mentor/details', options)
            let result = await mentorDetailsResponse.json();
            if (result.error) {
                ErrorNotify(result.error)
            } else {
                setMentorDetails(result.result);
            }
            setDetailsLoading(false);
        }
        getMentorDetails();
    }, [])


    return (
        <>
            {(!skillsLoading && !detailsLoading) && (
                <>
                    <div className='flex justify-center items-center'>
                        <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                            <h1 className='text-xl font-semibold text-black w-full my-4'> Position </h1>
                            <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {mentorDetails && mentorDetails.profession} </p>
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                            <h1 className='text-xl font-semibold text-black w-full my-4'> Company </h1>
                            <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {mentorDetails && mentorDetails.company} </p>
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                            <h1 className='text-xl font-semibold text-black w-full my-4'> Experience </h1>
                            <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {mentorDetails && (mentorDetails.experience + ' years')} </p>
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className='grid grid-cols-4 gap-2 w-full mx-10 my-4'>
                            <h1 className='text-2xl font-semibold text-center text-gray-800 my-4 col-span-4'>Skills</h1>
                            {mentorDetails.skills && mentorDetails.skills.skills.length > 0 && mentorDetails.skills.skills.map((skill, index) => (
                                <div key={index} className="bg-blue-500 rounded-full py-1 px-4 sm:px-2 flex items-center justify-center text-sm text-white shadow-md">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}