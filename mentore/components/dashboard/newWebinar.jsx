import React, { useState } from "react"
import { ErrorNotify, SuccessNotify } from "../global/toast";


export default function NewWebinar({ setWebinarDetailsLoading }) {
    const [webinarBtnText, setWebinarBtnText] = useState('Create webinar');
    const [newWebinarDetails, setNewWebinarDetails] = useState({ title: '', start: '', end: '' });

    // handles creating webinar
    const handleCreate = async () => {
        if (newWebinarDetails.title === '') {
            ErrorNotify('Please enter a valid title for the webinar');
            return;
        } else if (newWebinarDetails.title.trim() === '') {
            ErrorNotify('Please enter a valid title for the webinar');
            return;
        } else if (!newWebinarDetails.title.trim().match('^[a-zA-Z0-9-_]*$')) {
            ErrorNotify('The title can only contain letters, numbers, hyphens and underscores')
            return;
        } else if (newWebinarDetails.start === '') {
            ErrorNotify('Please enter a start date and time for the webinar')
            return;
        } else if (newWebinarDetails.end === '') {
            ErrorNotify('Please enter an end date and time for the webinar')
            return;
        } else if (new Date(newWebinarDetails.start).toISOString() > new Date(newWebinarDetails.end).toISOString()) {
            ErrorNotify('The start date and time cannot be greater than the end date and time')
            return;
        }

        const createMeeting = await fetch('https://mentore-ten.vercel.app/webinar/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newWebinarDetails)
        })
        const response = await createMeeting.json();

        if (response.error) {
            ErrorNotify(response.error);
        } else {
            SuccessNotify("Webinar created successfully");
        }
        setWebinarDetailsLoading(true);
    }

    const handleNewWebinar = (e) => {
        setNewWebinarDetails({ ...newWebinarDetails, [e.target.name]: e.target.value });
    }

    const handleWebinarCreateBtn = () => {
        if (webinarBtnText === 'Create webinar') {
            setWebinarBtnText('Cancel creation')
        } else {
            setWebinarBtnText('Create webinar')
        }
    }

    return (
        <div className='flex flex-col w-full mb-8 mt-4 px-14 justify-end'>
            <div onClick={handleWebinarCreateBtn} className='bg-[#f8db4edb] text-center focus:ring-2 focus:ring-black text-slate-[850] font-medium rounded-t-lg text-sm px-8 py-2'>{webinarBtnText}</div>
            {
                (webinarBtnText === 'Cancel creation') ? (
                    <div className="w-full bg-blue-50 rounded-b-lg p-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="title" className="font-bold mb-2">Title</label>
                                <input id="title" name="title" type="text" onChange={handleNewWebinar} className="w-full p-2 border border-blue-400 rounded-md" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="start" className="font-bold mb-2">Start time</label>
                                <input id="start" name="start" type="datetime-local" onChange={handleNewWebinar} className="w-full p-2 border border-blue-400 rounded-md" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="end" className="font-bold mb-2">End time</label>
                                <input id="end" name="end" type="datetime-local" onChange={handleNewWebinar} className="w-full p-2 border border-blue-400 rounded-md" />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={handleCreate} className="border border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm px-6 py-2">Schedule</button>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}