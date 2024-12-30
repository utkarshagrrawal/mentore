import React, { useState, useEffect } from "react";
import { ErrorNotify } from "../global/toast";

export default function MentorDetails({ id, mentorDetails, setMentorDetails }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getMentorDetails = async () => {
      let mentors = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/mentor/profile?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await mentors.json();
      if (result.error) {
        ErrorNotify("Some error occurred. Please try again");
      } else {
        setMentorDetails(result.result);
      }
      setLoading(false);
    };
    getMentorDetails();
  }, []);

  return (
    !loading && (
      <div className="container mx-auto drop-shadow-xl">
        <div className='bg-[url("https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/ProfileHeader.gif?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvUHJvZmlsZUhlYWRlci5naWYiLCJpYXQiOjE3MzAyMjgzMDEsImV4cCI6MTg4NzkwODMwMX0.NwDuLnbgeNByaYbkbJ5ZIXufUTM7LgG0Bc8uDUIcXeA&t=2024-10-29T18%3A58%3A21.680Z")] bg-no-repeat bg-cover min-h-32 rounded-t-lg mt-8'></div>
        <img
          src={
            mentorDetails && mentorDetails.gender
              ? "https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/male-avatar.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWFsZS1hdmF0YXIuanBnIiwiaWF0IjoxNzMwMTk4MjkwLCJleHAiOjE4ODc4NzgyOTB9.OsZVY6VkQfE2MQEyBKfQydaM7g8eu-62rLqy2hsVRdo&t=2024-10-29T10%3A38%3A10.382Z"
              : "https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/female-avatar.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvZmVtYWxlLWF2YXRhci5qcGciLCJpYXQiOjE3MzAxOTgzMzgsImV4cCI6MTg4Nzg3ODMzOH0.TL2QQ5-IkI2IaYXwD12l0CnWGUwE1MXPTB4T-uIwSSU&t=2024-10-29T10%3A38%3A58.633Z"
          }
          className="w-32 h-36 object-cover rounded-full absolute -mt-20 sm:ml-4 ml-4 border-4 border-white"
          alt="mentor"
        />
        <div className="bg-gray-100 min-h-32 rounded-b-lg py-4">
          <div className="pt-14 pl-6 flex items-center gap-2">
            <h3 className="text-2xl font-semibold">
              {mentorDetails && mentorDetails.name}
            </h3>
            <span>
              {mentorDetails && mentorDetails.gender ? "(He/him)" : "(She/her)"}
            </span>
          </div>
          <h3 className="pt-1 pl-6 font-semibold">
            {mentorDetails && mentorDetails.profession} at{" "}
            {mentorDetails && mentorDetails.company}
          </h3>
          <h3 className="pt-1 pl-6">
            <span className="font-semibold">Experience:</span>{" "}
            {mentorDetails && mentorDetails.experience} years
          </h3>
          <h3 className="pt-1 pl-6">
            <span className="font-semibold">Fees:</span>{" "}
            {mentorDetails && mentorDetails.fees} INR
          </h3>
          <div className="pt-1 pl-6 flex flex-col gap-2">
            <h3 className="font-semibold">Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {mentorDetails.skills &&
                mentorDetails.skills.skills?.map((skill, index) => {
                  return (
                    <span
                      key={index}
                      className="bg-slate-300 font-medium text-black px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
