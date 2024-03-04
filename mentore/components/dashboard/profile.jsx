import React from "react";
import MentorProfile from "./mentorDetails";

export default function Profile({ user, isMentor }) {

    return (
        <div className='w-full'>
            <div className='gap-4 sm:grid sm:grid-cols-4 flex flex-col mt-8 mx-10 sm:mx-14'>
                <div className='w-full border-solid border-2 border-dark-500 rounded-lg'>
                    <div className='flex flex-col items-center mx-4 lg:mx-16 my-10 h-48'>
                        {user.current.male ? (
                            <img src="../static/male-avatar.png" className="h-36 w-36 rounded-full" alt="Profile" />
                        ) : (
                            <img src="../static/female-avatar.png" className="h-36 w-36 rounded-full" alt="Profile" />
                        )}
                        <h1 className='text-3xl text-center font-semibold text-black'> {user.current && user.current.name && user.current.name.trim()} </h1>
                    </div>
                </div>
                <div className='w-full col-span-3 border-solid border-2 border-dark-500 rounded-lg'>
                    <div className='flex flex-col'>
                        <div className='flex justify-center items-center'>
                            <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                                <h1 className='text-xl font-semibold text-black w-full my-4'> Email </h1>
                                <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {user.current && user.current.email} </p>
                            </div>
                        </div>
                        <div className='flex justify-center items-center'>
                            <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                                <h1 className='text-xl font-semibold text-black w-full my-4'> DOB </h1>
                                <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {user.current && new Date(user.current.dob).toLocaleDateString()} </p>
                            </div>
                        </div>
                        <div className='flex justify-center items-center'>
                            <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                                <h1 className='text-xl font-semibold text-black w-full my-4'> Type </h1>
                                <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {user.current && user.current.type} </p>
                            </div>
                        </div>
                        {isMentor && <MentorProfile />}
                    </div>
                </div>
            </div>
        </div>
    )
}