import React, { useEffect, useRef, useState } from "react";
import {
  DismissToast,
  ErrorNotify,
  Loading,
  SuccessNotify,
} from "../global/toast";

export default function MentorProfile() {
  const [mentorDetails, setMentorDetails] = useState({});
  const allSkills = useRef([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [updatingFees, setUpdatingFees] = useState(false);

  useEffect(() => {
    const getSkills = async () => {
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      };
      let skills = await fetch(
        "https://mentore-backend.vercel.app/mentor/skill-options",
        options
      );
      let result = await skills.json();
      if (result.error) {
        ErrorNotify("Some error occured. Please try again");
      } else {
        allSkills.current = result.result;
      }
      setSkillsLoading(false);
    };
    getSkills();
  }, []);

  useEffect(() => {
    const getMentorDetails = async () => {
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      };
      let mentorDetailsResponse = await fetch(
        "https://mentore-backend.vercel.app/mentor/details",
        options
      );
      let result = await mentorDetailsResponse.json();
      if (result.error) {
        ErrorNotify("Some error occured. Please try again");
      } else {
        setMentorDetails(result.result);
      }
      setDetailsLoading(false);
    };
    getMentorDetails();
  }, []);

  const handleChange = (e) => {
    setMentorDetails({ ...mentorDetails, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (mentorDetails.fees <= 99 || mentorDetails.fees > 10000) {
      return ErrorNotify("Fees should be between 100 and 10000");
    }
    const toastId = Loading("Updating fees");
    setUpdatingFees(true);
    let options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ fees: mentorDetails.fees }),
    };
    let response = await fetch(
      "https://mentore-backend.vercel.app/mentor/fees/update",
      options
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
    <>
      {!skillsLoading && !detailsLoading && (
        <>
          <div className="mx-auto w-full">
            <div className="my-2">
              <h1 className="text-xl font-semibold text-black mb-2">
                Position
              </h1>
              <p className="bg-gray-200 rounded-md p-2 text-gray-900">
                {mentorDetails && mentorDetails.profession}
              </p>
            </div>
            <div className="my-2">
              <h1 className="text-xl font-semibold text-black mb-2">Company</h1>
              <p className="bg-gray-200 rounded-md p-2 text-gray-900">
                {mentorDetails && mentorDetails.company}
              </p>
            </div>
            <div className="my-2">
              <h1 className="text-xl font-semibold text-black mb-2">
                Experience
              </h1>
              <p className="bg-gray-200 rounded-md p-2 text-gray-900">
                {mentorDetails && mentorDetails.experience} years
              </p>
            </div>
            <div className="my-2">
              <h1 className="text-xl font-semibold text-black mb-2">Skills</h1>
              <div className="flex flex-wrap gap-2">
                {mentorDetails.skills &&
                  mentorDetails.skills.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-300 text-black px-3 py-1 rounded-full font-semibold text-sm"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
            <div className="my-2">
              <h1 className="text-xl font-semibold text-black mb-2">Fees</h1>
              <div className="flex w-full">
                <input
                  type="number"
                  className="border rounded-md p-2 text-gray-900 w-full"
                  min={0}
                  max={10000}
                  name="fees"
                  value={mentorDetails.fees}
                  onChange={handleChange}
                />
                <button
                  className="bg-blue-500 text-white rounded-md p-2 ml-2"
                  onClick={handleUpdate}
                  disabled={updatingFees}
                >
                  {updatingFees ? (
                    <div className="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-blue-600" />
                  ) : (
                    " Update"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
