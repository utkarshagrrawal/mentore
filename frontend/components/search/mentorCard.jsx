import React from "react";
import { Link } from "react-router-dom";

export default function MentorCard({ index, mentor }) {
  return (
    <div
      key={index}
      className="max-w-sm w-full mx-16 px-4 h-[32rem] py-8 bg-gray-100 mb-8 border border-gray-200 rounded-2xl shadow hover:shadow-2xl duration-200"
    >
      <img
        className="rounded-t-lg h-48 object-contain w-full mix-blend-multiply"
        src={
          mentor && mentor.gender
            ? "https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/male-avatar.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWFsZS1hdmF0YXIuanBnIiwiaWF0IjoxNzMwMTk4MjkwLCJleHAiOjE4ODc4NzgyOTB9.OsZVY6VkQfE2MQEyBKfQydaM7g8eu-62rLqy2hsVRdo&t=2024-10-29T10%3A38%3A10.382Z"
            : "https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/female-avatar.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvZmVtYWxlLWF2YXRhci5qcGciLCJpYXQiOjE3MzAxOTgzMzgsImV4cCI6MTg4Nzg3ODMzOH0.TL2QQ5-IkI2IaYXwD12l0CnWGUwE1MXPTB4T-uIwSSU&t=2024-10-29T10%3A38%3A58.633Z"
        }
        alt=""
      />
      <div className="p-5 h-72 flex flex-col justify-between">
        <div>
          <h5 className="text-2xl mb-4 font-bold tracking-tight text-gray-900 text-center">
            {mentor && mentor.name}
          </h5>
          <p className="text-gray-700 text-center font-semibold">
            {mentor && mentor.profession}
          </p>
          <p className="font-normal text-gray-700 text-center mt-4">
            {mentor && mentor.company}
          </p>
          <p className="font-normal text-gray-700 text-center">
            Experience: {mentor.experience} years
          </p>
        </div>
        <div>
          <Link
            to={`/mentor/${mentor.uniq_id || mentor.uuid}`}
            className="flex justify-center mt-4 items-center px-3 py-2 text-sm font-medium text-white border border-black duration-200 rounded-lg bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
