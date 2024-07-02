import React from "react";
import MentorProfile from "./mentorDetails";

export default function Profile({ user, isMentor }) {
  return (
    <div className="w-full">
      <div className="flex flex-col mt-8 mx-10 sm:mx-14">
        <div className="w-full border-2 border-solid border-dark-500 rounded-lg p-4 flex items-center justify-between gap-4 bg-gray-100 shadow-md">
          <img
            src={
              user.current.male
                ? "https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/male-avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbWFsZS1hdmF0YXIucG5nIiwiaWF0IjoxNzExMTg4ODM3LCJleHAiOjE3NDI3MjQ4Mzd9.qExdt9gnnYndht7-boBf9JR7TXV4f5r87clKZAZx3ZI&t=2024-03-23T10%3A13%3A57.836Z"
                : "https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/female-avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvZmVtYWxlLWF2YXRhci5wbmciLCJpYXQiOjE3MTExODg4MDEsImV4cCI6MTc0MjcyNDgwMX0.SkW7zn8MTdTp2yQO3BousTpWQ3kBPQ2IT4wDLLKyamU&t=2024-03-23T10%3A13%3A21.412Z"
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
