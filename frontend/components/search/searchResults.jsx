import React, { useState, useEffect, useRef } from "react";
import MentorCard from "./mentorCard";
import Header from "../global/header";
import {
  DismissToast,
  ErrorNotify,
  Loading,
  SuccessNotify,
} from "../global/toast";
import { useSearchParams } from "react-router-dom";

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search_query") || ""
  );
  const [loggedIn, setLoggedIn] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [mentors, setMentors] = useState([]);
  const [currentMentors, setCurrentMentors] = useState([]);
  const allMentors = useRef([]);

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
        setLoggedIn(true);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getAllMentors = async () => {
      let mentorDetail = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/mentor/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      let result = await mentorDetail.json();
      if (result.error) {
        ErrorNotify("Some error occured. Please try again");
      } else {
        setMentors(result.result);
        allMentors.current = result.result;
      }
      setDetailsLoading(false);
    };
    getAllMentors();
  }, []);

  useEffect(() => {
    let controller = new AbortController();

    const findMentors = async () => {
      let toastId;

      try {
        DismissToast(toastId);
        toastId = Loading("Searching for mentors");

        const response = await fetch(
          import.meta.env.VITE_BACKEND_URL + "/search/" + searchQuery,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            signal: controller.signal,
          }
        );
        const result = await response.json();

        setCurrentPage(0);

        DismissToast(toastId);

        if (result.Error) {
          ErrorNotify("Some error occured. Please try again");
        } else {
          if (JSON.parse(result.response).length > 0) {
            SuccessNotify("Mentors found");
            setMentors(JSON.parse(result.response));
          } else {
            const toastId = Loading(
              "No mentors found. Searching for names similar to the query"
            );
            setMentors(() => {
              return allMentors.current.filter((person) => {
                if (
                  person.name.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                  return person;
                }
              });
            });

            DismissToast(toastId);
          }
        }
      } catch (error) {}
    };

    if (searchQuery !== "") {
      findMentors();
    }

    return () => controller.abort();
  }, [searchQuery]);

  useEffect(() => {
    const scrollListener = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        setCurrentPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, [mentors]);

  useEffect(() => {
    setCurrentMentors(mentors.slice(0, currentPage * 3 + 6));
  }, [currentPage, mentors]);

  return (
    <div className="min-h-screen items-center flex flex-col w-full">
      <Header
        loggedIn={loggedIn}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Mentor Grid */}
      <div className="w-full my-10">
        {!detailsLoading && (
          <div className="grid lg:grid-cols-3 gap-2 md:grid-cols-2 grid-cols-1 place-content-center place-items-center drop-shadow-xl">
            {currentMentors?.length > 0 &&
              currentMentors.map((mentor, index) => (
                <MentorCard key={index} mentor={mentor} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
