import React from "react";
import {
  DismissToast,
  ErrorNotify,
  Loading,
  SuccessNotify,
} from "../global/toast";
import { Link } from "react-router-dom";

export default function WebinarCard({ user, webinar, setLoading }) {
  const dateFormatter = Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "full",
  });

  const handleJoinWebinar = async (meeting_id) => {
    let webinarJoiningType =
      webinar.mentor_email === user.current?.email ? "host" : "participant";
    const toastId = Loading("Joining the webinar");
    let webinars = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/webinar/join/" + webinarJoiningType,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meeting_id: meeting_id,
        }),
        credentials: "include",
      }
    );
    const result = await webinars.json();
    if (!result.success) {
      ErrorNotify("Some error occurred while joining the webinar");
    } else {
      location.href = result.success;
    }
    DismissToast(toastId);
  };

  const handleRegister = async (id) => {
    if (user.current?.email === undefined) {
      return ErrorNotify("Please login to register for the webinar");
    }
    const toastId = Loading("Registering for the webinar");
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/webinar/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          webinar_id: id,
        }),
      }
    );
    const result = await response.json();
    if (result.error) {
      ErrorNotify("Some error occured. Please try again");
    } else {
      SuccessNotify("Registered for the webinar successfully");
      setLoading(true);
    }
    DismissToast(toastId);
  };

  const checkRegistered = (item) => {
    if (
      item.registered_users?.includes(user.current?.email) &&
      new Date().toISOString() > new Date(item.start_time).toISOString() &&
      new Date().toISOString() < new Date(item.end_time).toISOString()
    ) {
      return "Join webinar";
    } else {
      return "Pending";
    }
  };

  return (
    <div className="sm:max-w-sm bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg duration-200 relative overflow-hidden flex flex-col justify-between p-4">
      <div>
        {new Date(webinar.start_time).toISOString() <
          new Date().toISOString() && (
          <div className="absolute top-0 right-0">
            <div className="inline-block relative px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded-l-lg">
              Live
              <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-ping"></span>
            </div>
          </div>
        )}
      </div>
      <div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">
          {webinar.title}
        </h3>
        <h5 className="text-sm mb-3 text-gray-500">
          Hosted by {webinar.mentor_name}
        </h5>
        <div className="flex items-center text-gray-700 text-sm mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          <span>{dateFormatter.format(new Date(webinar.start_time))}</span>
        </div>
        <div className="flex items-center text-gray-700 text-sm mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          <span>{dateFormatter.format(new Date(webinar.end_time))}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={() => handleRegister(webinar.id)}
          disabled={
            webinar.registered_users?.includes(user.current?.email) && true
          }
          className={
            webinar.registered_users?.includes(user.current?.email)
              ? "px-3 py-2 text-sm font-medium border text-white rounded-lg bg-green-600"
              : "px-3 py-2 text-sm font-medium border border-blue-700 rounded-lg duration-200 hover:text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          }
        >
          {webinar.registered_users?.includes(user.current?.email)
            ? "Registered"
            : "Register"}
        </button>
        <button
          disabled={checkRegistered(webinar) === "Join webinar" ? false : true}
          onClick={() => handleJoinWebinar(webinar.meeting_link)}
          target="_blank"
          className={
            checkRegistered(webinar) === "Join webinar"
              ? "px-3 py-2 text-sm font-medium border border-blue-700 duration-200 hover:text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              : "px-3 py-2 text-sm font-medium border bg-[#fdc113] duration-200 rounded-lg"
          }
        >
          {checkRegistered(webinar)}
        </button>
      </div>
    </div>
  );
}
