import React from "react";
import MentorProfile from "./mentorDetails";

export default function Profile({ user, isMentor }) {
  return (
    <div className="w-full">
      <div className="flex flex-col mt-8 mx-10 sm:mx-14">
        <div className="w-full border-2 border-solid border-dark-500 rounded-lg p-4 flex items-center justify-between gap-4 bg-gray-100 shadow-md">
          <img
            src={
              user.current.gender
                ? "https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/male-avatar.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWFsZS1hdmF0YXIuanBnIiwiaWF0IjoxNzMwMTk4MjkwLCJleHAiOjE4ODc4NzgyOTB9.OsZVY6VkQfE2MQEyBKfQydaM7g8eu-62rLqy2hsVRdo&t=2024-10-29T10%3A38%3A10.382Z"
                : "https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/female-avatar.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvZmVtYWxlLWF2YXRhci5qcGciLCJpYXQiOjE3MzAxOTgzMzgsImV4cCI6MTg4Nzg3ODMzOH0.TL2QQ5-IkI2IaYXwD12l0CnWGUwE1MXPTB4T-uIwSSU&t=2024-10-29T10%3A38%3A58.633Z"
            }
            className="h-auto w-20 rounded-full border-4 border-white shadow-md"
            alt="Profile"
          />
          <h1 className="text-3xl font-semibold text-gray-800">
            {user.current && user.current.name && user.current.name.trim()}
          </h1>
        </div>

        <div className="w-full col-span-3 border-2 border-solid border-dark-500 rounded-lg p-4 mt-10">
          <div className="flex flex-col">
            <div className="my-2">
              <h1 className="text-xl font-semibold text-black mb-2">Email</h1>
              <p className="bg-gray-200 rounded-md p-2 text-gray-900">
                {user.current && user.current.email}
              </p>
            </div>
            <div className="my-2">
              <h1 className="text-xl font-semibold text-black mb-2">DOB</h1>
              <p className="bg-gray-200 rounded-md p-2 text-gray-900">
                {user.current &&
                  new Date(user.current.dob).toLocaleDateString()}
              </p>
            </div>
            <div className="my-2">
              <h1 className="text-xl font-semibold text-black mb-2">Type</h1>
              <p className="bg-gray-200 rounded-md p-2 text-gray-900">
                {user.current && user.current.type}
              </p>
            </div>
            {isMentor && <MentorProfile />}
          </div>
        </div>
      </div>
    </div>
  );
}
