import React, { useEffect, useState, useRef } from "react";
import Header from "../global/header";
import { ErrorNotify } from "../global/toast";
import WebinarsDisplay from "./webinarsDisplay";

export function WebinarsPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [startDate, setStartDate] = useState("");

  const user = useRef({});

  const [allWebinars, setAllWebinars] = useState([]);
  const [filteredWebinars, setFilteredWebinars] = useState([]);

  useEffect(() => {
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
        user.current = result.result;
        setLoggedIn(true);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const webinars = async () => {
      let webinars = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/webinar/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await webinars.json();
      if (result.error) {
        ErrorNotify("Some error occurred while fetching webinars");
      } else {
        setAllWebinars(result.success);
        setFilteredWebinars(result.success);
        setLoading(false);
      }
    };
    if (loading) {
      webinars();
    }
  }, [loading]);

  const handleFilter = () => {
    const filteredWebinars1 = allWebinars.filter((webinar) => {
      const webinarTitle = webinar.title.toLowerCase();
      const authorName = webinar.mentor_name.toLowerCase();
      const webinarStartDate = new Date(webinar.start_time).toDateString();
      const filterStartDate = new Date(startDate).toDateString();

      return (
        webinarTitle.includes(searchTitle.toLowerCase()) &&
        authorName.includes(searchAuthor.toLowerCase()) &&
        (!startDate || webinarStartDate === filterStartDate)
      );
    });

    setFilteredWebinars(filteredWebinars1);
  };

  return (
    <div className="min-h-screen container mx-auto">
      <Header loggedIn={loggedIn} />
      <div className="w-full mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Search and Filter
        </h2>
        <div className="flex sm:flex-row flex-col gap-2 w-full items-center mb-10">
          <input
            className="rounded-lg w-3/4 md:w-full border border-gray-300 p-3 focus:outline-none"
            type="text"
            placeholder="Webinar Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <input
            className="rounded-lg w-3/4 md:w-full border border-gray-300 p-3 focus:outline-none"
            type="text"
            placeholder="Author Name"
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
          />
          <input
            className="rounded-lg w-3/4 md:w-full border border-gray-300 p-3 focus:outline-none"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white w-3/4 md:w-full p-3 rounded-md transition-colors duration-300 ease-in-out"
            onClick={handleFilter}
          >
            Filter
          </button>
        </div>
      </div>
      <div className="w-full">
        {filteredWebinars?.length > 0 ? (
          <WebinarsDisplay
            allWebinars={filteredWebinars}
            loading={loading}
            setLoading={setLoading}
            user={user}
          />
        ) : (
          <p className="mt-4 text-gray-600 text-lg font-medium text-center">
            No live webinars currently
          </p>
        )}
      </div>
    </div>
  );
}
