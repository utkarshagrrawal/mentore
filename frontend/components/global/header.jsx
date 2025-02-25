import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { RiLoginCircleLine } from "react-icons/ri";

export default function Header(props) {
  const navigate = useNavigate();
  const [searchBoxValue, setSearchBoxValue] = useState("");
  const clearId = useRef("");

  const handleLogin = () => {
    if (props?.loggedIn) {
      return navigate("/user/dashboard");
    }
    return navigate("/user/login");
  };

  useEffect(() => {
    if (props?.searchQuery) {
      setSearchBoxValue(props?.searchQuery);
    }
  }, []);

  const handleSearch = (e) => {
    clearTimeout(clearId.current);
    clearId.current = setTimeout(() => {
      navigate("/results?search_query=" + e.target.value);
      props?.setSearchQuery && props?.setSearchQuery(e.target.value);
    }, 500);
    setSearchBoxValue(e.target.value);
  };

  const handleNavigateHome = () => {
    location.href = "/";
    props?.setSearchQuery && props?.setSearchQuery("");
  };

  return (
    <>
      <header className="container mx-auto min-[572px]:block hidden">
        <div className="flex flex-wrap items-center min-[573px]:justify-between py-4">
          <Link
            onClick={handleNavigateHome}
            className="flex items-center justify-center gap-2"
          >
            <img
              src="https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/mentore.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWVudG9yZS5qcGciLCJpYXQiOjE3MzAxODUwOTQsImV4cCI6MTg4Nzg2NTA5NH0.kJcsFJEOAC4hrV88B9d0FnDp1wgpntRboWfe0RIJAOo&t=2024-10-29T06%3A58%3A14.455Z"
              className="h-8 mix-blend-multiply"
              alt="Mentore"
            />
            <span className="text-2xl font-semibold text-blue-700">
              Mentore
            </span>
          </Link>
          <input
            type="search"
            placeholder="Search for domain, mentors..."
            className="lg:w-[40rem] md:w-[26rem] w-[16rem] border-2 border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
            value={searchBoxValue}
            onChange={handleSearch}
            autoFocus
          />
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm text-blue-700 bg-blue-100 hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out"
          >
            {props?.loggedIn ? <MdSpaceDashboard /> : <RiLoginCircleLine />}
            {props?.loggedIn ? "Dashboard" : "Login"}
          </button>
        </div>
      </header>
      <header className="container mx-auto min-[572px]:hidden block">
        <div className="flex flex-wrap items-center justify-between flex-col py-4">
          <div className="flex justify-between items-center w-full">
            <Link
              onClick={handleNavigateHome}
              className="flex items-center justify-center gap-2"
            >
              <img
                src="https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/mentore.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWVudG9yZS5qcGciLCJpYXQiOjE3MzAxODUwOTQsImV4cCI6MTg4Nzg2NTA5NH0.kJcsFJEOAC4hrV88B9d0FnDp1wgpntRboWfe0RIJAOo&t=2024-10-29T06%3A58%3A14.455Z"
                className="h-8 mix-blend-multiply"
                alt="Mentore"
              />
              <span className="text-2xl font-semibold text-blue-700">
                Mentore
              </span>
            </Link>
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm text-blue-700 bg-blue-100 hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out"
            >
              {props?.loggedIn ? <MdSpaceDashboard /> : <RiLoginCircleLine />}
              {props?.loggedIn ? "Dashboard" : "Login"}
            </button>
          </div>
          <input
            type="search"
            placeholder="Search for domain, mentors..."
            className="w-full border-2 border-blue-700 rounded-lg px-4 mt-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300"
            value={searchBoxValue}
            onChange={handleSearch}
            autoFocus
          />
        </div>
      </header>
    </>
  );
}
