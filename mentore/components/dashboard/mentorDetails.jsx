import React, { useEffect, useRef, useState } from "react";
import Select from 'react-select';
import Swal from "sweetalert2";


export default function MentorProfile() {
    const mentorDetails = useRef({});
    const allSkills = useRef([]);
    const [skillsLoading, setSkillsLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(true);

    useEffect(() => {
        const getSkills = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            let skills = await fetch('http://localhost:3000/getallskills', options)
            let result = await skills.json();
            if (result.error) {
                Swal.fire(
                    'Error',
                    result.error,
                    'error'
                )
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
                    'Content-Type': 'application/json'
                }
            }
            let mentorDetailsResponse = await fetch('http://localhost:3000/getmentordetails', options)
            let result = await mentorDetailsResponse.json();
            if (result.error) {
                Swal.fire(
                    'Error',
                    result.error,
                    'error'
                )
            } else {
                mentorDetails.current = result.result;
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
                            <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {mentorDetails.current && mentorDetails.current.profession} </p>
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                            <h1 className='text-xl font-semibold text-black w-full my-4'> Company </h1>
                            <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {mentorDetails.current && mentorDetails.current.company} </p>
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                            <h1 className='text-xl font-semibold text-black w-full my-4'> Experience </h1>
                            <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {mentorDetails.current && (mentorDetails.current.experience + ' years')} </p>
                        </div>
                    </div>
                    <div className='flex justify-center items-center'>
                        <div className='grid grid-cols-4 w-full mx-10 my-4'>
                            <h1 className='text-xl font-semibold text-black w-full my-4'> Skills </h1>
                            <Select isMulti className="basic-multi-select w-full col-span-3" isDisabled={true}
                                classNamePrefix="select" defaultValue={mentorDetails.current && mentorDetails.current.skills.skills.map(skill => {
                                    return { value: skill, label: skill }
                                })} options={
                                    allSkills.current.map((skill) => {
                                        return { value: skill.name, label: skill.name }
                                    })} />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}