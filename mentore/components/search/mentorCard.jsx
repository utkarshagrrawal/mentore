import React from 'react';
import { Link } from 'react-router-dom';

export default function MentorCard({ index, mentor }) {
    return (
        <div
            key={index}
            className='max-w-sm w-full mx-16 px-4 pt-8 pb-8 bg-gray-100 mb-8 border border-gray-200 rounded-2xl shadow hover:shadow-2xl duration-200'
        >
            <img
                className='rounded-t-lg h-48 object-contain w-full mix-blend-multiply'
                src={
                    mentor && mentor.male
                        ? '../static/male-avatar.png'
                        : '../static/female-avatar.png'
                }
                alt=''
            />
            <div className='p-5 relative min-h-[15rem]'>
                <h5 className='mb-2 text-2xl mb-4 font-bold tracking-tight text-gray-900 text-center'>
                    {mentor && mentor.name}
                </h5>
                <p className='font-normal text-gray-700 text-center font-semibold'>
                    {mentor && mentor.profession}
                </p>
                <p className='font-normal text-gray-700 text-center'>
                    {' '}
                    {mentor && mentor.company}
                </p>
                <p className='font-normal text-gray-700 text-center'>
                    Experience: {mentor.experience} years
                </p>
                <Link
                    to={`/mentor/${mentor.uniq_id}`}
                    className='flex justify-center w-[19.1rem] items-center bottom-0 absolute px-3 py-2 text-sm font-medium hover:text-white border-[0.1rem] border-black hover:duration-150 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
                >
                    View details
                </Link>
            </div>
        </div>
    )
}