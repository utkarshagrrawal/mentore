import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../global/loader";
import Header from "../global/header";
import MentorDetails from "./mentorDetails";
import BookingRequest from "./bookingRequest";
import BookingsTable from "./bookingsTable";

export function BookMentor() {
  const { id } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [mentorDetails, setMentorDetails] = useState([]);

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      let users = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/user/details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await users.json();
      if (result.error) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const mentorCode = (
    <>
      <Header loggedIn={loggedIn} />

      <MentorDetails
        id={id}
        mentorDetails={mentorDetails}
        setMentorDetails={setMentorDetails}
      />

      <BookingRequest
        mentorId={id}
        mentorDetails={mentorDetails}
        setDataLoading={setDataLoading}
      />

      <BookingsTable
        loggedIn={loggedIn}
        dataLoading={dataLoading}
        setDataLoading={setDataLoading}
        id={id}
        mentorDetails={mentorDetails}
      />
    </>
  );

  return (
    <div className="w-full min-h-screen flex items-center flex-col">
      {loading ? <Loader /> : mentorCode}
    </div>
  );
}
