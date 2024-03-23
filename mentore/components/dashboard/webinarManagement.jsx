import React, { useEffect, useRef, useState } from "react";
import { DismissToast, ErrorNotify, Loading, SuccessNotify } from "../global/toast";

export default function WebinarManagement({ webinarDetailsLoading, setWebinarDetailsLoading }) {
    const dateFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

    const allWebinars = useRef([]);

    useEffect(() => {
        const getWebinars = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                },
            }
            let webinars = await fetch('https://mentore-ten.vercel.app/mentor/webinars', options);
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
                "Authorization": localStorage.getItem('token')
            },
            body: JSON.stringify({
                "meeting_id": link
            })
        };
        const toastId = Loading('Joining the webinar');
        let webinars = await fetch('https://mentore-ten.vercel.app/webinar/join/host', options);
        const result = await webinars.json();
        if (!result.success) {
            ErrorNotify("Some error occurred while joining the webinar")
        } else {
            location.href = result.success;
        }
        DismissToast(toastId);
    }

    return (
        <>
            <h1 className='text-center text-3xl font-bold my-4'>Schedule webinars</h1>
            <div className='w-full'>
                <div className="relative overflow-x-auto mx-14 shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-blue-100 table-fixed">
                        <thead className="text-xs text-white uppercase bg-[#6c92df]">
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
                            {!webinarDetailsLoading && allWebinars.current?.length > 0 ? allWebinars.current.map((item, id) => {
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
                            }) : (
                                <tr className="text-center">
                                    <td className="px-6 py-4 text-black" colSpan='4'>
                                        No webinars
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}