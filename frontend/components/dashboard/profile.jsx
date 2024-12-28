import React, { useState } from "react";
import {
  DismissToast,
  ErrorNotify,
  Loading,
  SuccessNotify,
} from "../global/toast";

export default function Profile({ user }) {
  const [fees, setFees] = useState(user.fees);
  const [updatingFees, setUpdatingFees] = useState(false);

  const handleUpdate = async () => {
    if (fees <= 99 || fees > 10000) {
      return ErrorNotify("Fees should be between 100 and 10000");
    }
    const toastId = Loading("Updating fees");
    setUpdatingFees(true);
    let response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/mentor/fees/update",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ fees }),
      }
    );
    let result = await response.json();
    DismissToast(toastId);
    setUpdatingFees(false);
    if (result.error) {
      ErrorNotify("Some error occured. Please try again");
    } else {
      SuccessNotify("Fees updated successfully");
    }
  };

  return (
    <div className="container mx-auto my-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center bg-gray-50 p-6 gap-6 border-gray-200">
        <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-blue-500">
          <img
            src={
              user.gender
                ? "https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/male-avatar.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWFsZS1hdmF0YXIuanBnIiwiaWF0IjoxNzMwMTk4MjkwLCJleHAiOjE4ODc4NzgyOTB9.OsZVY6VkQfE2MQEyBKfQydaM7g8eu-62rLqy2hsVRdo&t=2024-10-29T10%3A38%3A10.382Z"
                : "https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/female-avatar.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvZmVtYWxlLWF2YXRhci5qcGciLCJpYXQiOjE3MzAxOTgzMzgsImV4cCI6MTg4Nzg3ODMzOH0.TL2QQ5-IkI2IaYXwD12l0CnWGUwE1MXPTB4T-uIwSSU&t=2024-10-29T10%3A38%3A58.633Z"
            }
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-800">
            {user?.name?.trim()}
          </h3>
          <p className="text-md text-gray-600">{user?.profession}</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="text"
              value={user?.email}
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-100"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="dob" className="block text-gray-700 font-medium">
              Date of Birth
            </label>
            <input
              type="date"
              value={user?.dob?.split("T")[0]}
              className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-100"
              readOnly
            />
          </div>
          {user.type === "mentor" && (
            <div>
              <label
                htmlFor="company"
                className="block text-gray-700 font-medium"
              >
                Company
              </label>
              <input
                type="text"
                value={user?.company}
                className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-gray-100"
                readOnly
              />
            </div>
          )}
        </div>

        {user.type === "mentor" && (
          <>
            <div className="flex justify-between items-center pt-2">
              <h4 className="text-lg font-semibold text-gray-800">
                Experience
              </h4>
              <p className="text-gray-600 font-medium bg-blue-100 px-3 py-1 rounded-md">
                {user?.experience} Years
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800">Skills</h4>
              <div className="flex flex-wrap gap-2 mt-3">
                {user?.skills?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="w-1/2">
                <label
                  htmlFor="fees"
                  className="block text-gray-700 font-medium"
                >
                  Consultation Fees
                </label>
                <input
                  type="number"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  min={100}
                  max={10000}
                  className="w-full mt-2 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <button
                className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg px-6 py-3 transition duration-200 ${
                  updatingFees && "opacity-50 cursor-not-allowed"
                }`}
                disabled={updatingFees}
                onClick={handleUpdate}
              >
                Update Profile
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
