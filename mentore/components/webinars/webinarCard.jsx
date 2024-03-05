import React from "react";
import { DismissToast, ErrorNotify, Loading } from "../global/toast";
import { Link } from "react-router-dom";


export default function WebinarCard({ webinar }) {
    const dateFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "full" })

    const handleJoinWebinar = async (meeting_id) => {
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "meeting_id": meeting_id
            })
        };
        const toastId = Loading();
        let webinars = await fetch('http://localhost:3000/joinwebinarparticipant', options);
        const result = await webinars.json();
        if (!result.success) {
            ErrorNotify("Some error occurred while joining the webinar")
        } else {
            location.href = result.success;
        }
        DismissToast(toastId);
    }

    return (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-2xl duration-300 relative">
            {new Date(webinar.start_time).toISOString() < new Date().toISOString() && (
                <div className="absolute right-0">
                    <div className="inline-block relative px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-r-sm rounded-l-lg">
                        Live
                        <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full shadow-md animate-ping"></span>
                    </div>
                </div>
            )}
            <Link to="/">
                <img className="rounded-t-lg" src="https://static.vecteezy.com/system/resources/previews/029/694/959/original/course-learning-mentor-tutor-webinar-icon-web-education-technology-program-in-virtual-online-learning-class-conference-or-tutorial-training-app-illustration-design-on-white-background-eps10-vector.jpg" alt="" />
            </Link>
            <div className="p-5">
                <Link to="/">
                    <h5 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">{webinar.title}</h5>
                </Link>
                <div className="flex items-center text-gray-600 text-sm mb-3">
                    <span className="font-semibold text-lg">{'By: ' + webinar.mentor_name}</span>
                </div>
                <div className="flex items-center text-gray-600 text-md mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{'From: ' + dateFormatter.format(new Date(webinar.start_time))}</span>
                </div>
                <div className="flex items-center text-gray-600 text-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{'Till: ' + dateFormatter.format(new Date(webinar.end_time))}</span>
                </div>
                <button disabled={new Date(webinar.start_time).toISOString() < new Date().toISOString() ? false : true} onClick={() => handleJoinWebinar(webinar.meeting_link)} target="_blank" className={new Date(webinar.start_time).toISOString() < new Date().toISOString() ? "inline-flex mt-4 w-full items-center px-3 py-2 text-sm font-medium border border-blue-700 duration-200 hover:text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300" : "inline-flex mt-4 w-full items-center px-3 py-2 text-sm font-medium border border-yellow-700 bg-[#fdc113] duration-200 rounded-lg"}>
                    {new Date(webinar.start_time).toISOString() < new Date().toISOString() ? 'Join webinar' : 'Webinar not started yet'}
                </button>
            </div>
        </div>
    )
}