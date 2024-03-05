import React, { useEffect, useRef, useState } from "react";
import { DismissToast, ErrorNotify, Loading, SuccessNotify } from "../global/toast";

export default function WebinarManagement() {
    const dateFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

    const [webinarDetailsLoading, setWebinarDetailsLoading] = useState(true);
    const [webinarBtnText, setWebinarBtnText] = useState('Create webinar');
    const [newWebinarDetails, setNewWebinarDetails] = useState({ title: '', start: '', end: '' });
    const allWebinars = useRef([]);

    useEffect(() => {
        const getWebinars = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            let webinars = await fetch('http://localhost:3000/getwebinars', options);
            let response = await webinars.json();
            allWebinars.current = response.success;
            setWebinarDetailsLoading(false);
        }
        if (webinarDetailsLoading) {
            getWebinars();
        }
    }, [webinarDetailsLoading])

    const handleJoinWebinar = async (link) => {
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "meeting_id": link
            })
        };
        const toastId = Loading();
        let webinars = await fetch('http://localhost:3000/joinwebinarhost', options);
        const result = await webinars.json();
        if (!result.success) {
            ErrorNotify("Some error occurred while joining the webinar")
        } else {
            location.href = result.success;
        }
        DismissToast(toastId);
    }

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

        const createMeeting = await fetch('http://localhost:3000/createwebinar', {
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

    // handles webinar details
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
        <>
            <h1 className='text-center text-3xl font-bold my-4'>Schedule webinars</h1>
            <div className='w-full'>
                <div className="relative overflow-x-auto mx-14 shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-blue-100 table-fixed">
                        <thead className="text-xs text-white uppercase bg-blue-600">
                            <tr className='text-center'>
                                <th scope="col" className="px-6 py-3">
                                    Date and time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Till date and time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Link
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!webinarDetailsLoading && allWebinars.current.map((item, id) => {
                                if (new Date().toISOString() < new Date(item.end_time).toISOString()) {
                                    return (
                                        <tr key={id} className="border-b border-blue-400 text-center">
                                            <td className="px-6 py-4 text-black">
                                                {dateFormatter.format(new Date(item.start_time))}
                                            </td>
                                            <td className="px-6 py-4 text-black">
                                                {dateFormatter.format(new Date(item.end_time))}
                                            </td>
                                            <td className="px-6 py-4 text-black">
                                                {item.title}
                                            </td>
                                            <td className="px-6 py-4 text-black whitespace-pre-line">
                                                <button onClick={() => handleJoinWebinar(item.meeting_link)} target='_blank' className='border-[0.1rem] border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm px-8 py-1 w-full'>Join</button>
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='flex w-full mb-8 mt-4 px-14 justify-end'>
                <button onClick={handleWebinarCreateBtn} className='border-[0.1rem] bg-[#fdc113] focus:ring-2 focus:ring-black text-black font-medium rounded-lg text-sm px-8 py-1 w-full'>{webinarBtnText}</button>
            </div>
            {
                (webinarBtnText === 'Cancel creation') ? (
                    <div className="w-full mb-8">
                        <div className="mx-16 bg-blue-50 rounded-lg p-4 border-[0.01rem] border-black">
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
                    </div>
                ) : null
            }
        </>
    )
}