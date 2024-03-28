import React from 'react';
import { Link } from 'react-router-dom';

export default function MentorCard({ index, mentor }) {
    return (
        <div
            key={index}
            className='max-w-sm w-full mx-16 px-4 h-[32rem] py-8 bg-gray-100 mb-8 border border-gray-200 rounded-2xl shadow hover:shadow-2xl duration-200'
        >
            <img
                className='rounded-t-lg h-48 object-contain w-full mix-blend-multiply'
                src={
                    mentor && mentor.male
                        ? 'https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/male-avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbWFsZS1hdmF0YXIucG5nIiwiaWF0IjoxNzExMTg4ODM3LCJleHAiOjE3NDI3MjQ4Mzd9.qExdt9gnnYndht7-boBf9JR7TXV4f5r87clKZAZx3ZI&t=2024-03-23T10%3A13%3A57.836Z'
                        : 'https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/female-avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvZmVtYWxlLWF2YXRhci5wbmciLCJpYXQiOjE3MTExODg4MDEsImV4cCI6MTc0MjcyNDgwMX0.SkW7zn8MTdTp2yQO3BousTpWQ3kBPQ2IT4wDLLKyamU&t=2024-03-23T10%3A13%3A21.412Z'
                }
                alt=''
            />
            <div className='p-5 h-72 flex flex-col justify-between'>
                <div>
                    <h5 className='mb-2 text-2xl mb-4 font-bold tracking-tight text-gray-900 text-center'>
                        {mentor && mentor.name}
                    </h5>
                    <p className='font-normal text-gray-700 text-center font-semibold'>
                        {mentor && mentor.profession}
                    </p>
                    <p className='font-normal text-gray-700 text-center mt-4'>
                        {mentor && mentor.company}
                    </p>
                    <p className='font-normal text-gray-700 text-center'>
                        Experience: {mentor.experience} years
                    </p>
                </div>
                <div>
                    <Link
                        to={`/mentor/${mentor.uniq_id}`}
                        className='flex justify-center mt-4 items-center px-3 py-2 text-sm font-medium text-white border border-black duration-200 rounded-lg bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300'
                    >
                        View details
                    </Link>
                </div>
            </div>
        </div>
    )
}