import React, { useRef, useState, useEffect } from "react";
import { ErrorNotify } from "../global/toast";
import Header from "../global/header";
import BlogCard from "./insightCard";

const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export function Insights() {
  const user = useRef([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const allBlogs = useRef([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [currentBlogs, setCurrentBlogs] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.scrollHeight
      )
        setPage(page + 1);
    };
    const handleScrollDebounced = debounce(handleScroll, 1000);
    window.addEventListener("scroll", handleScrollDebounced);
    return () => window.removeEventListener("scroll", handleScrollDebounced);
  }, []);

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
    const getBlogs = async () => {
      let blogs = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/blog/all?page=" + page,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const response = await blogs.json();
      if (response.error) {
        ErrorNotify("Some error occurred while fetching blogs");
      } else {
        allBlogs.current = response.result;
        setCurrentBlogs(allBlogs.current);
      }
    };
    getBlogs();
  }, [page]);

  const handleFilter = () => {
    let filteredBlogs = allBlogs.current;

    // Filter by title if searchTitle is not empty
    if (searchTitle.trim() !== "") {
      filteredBlogs = filteredBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Filter by author if searchAuthor is not empty
    if (searchAuthor.trim() !== "") {
      filteredBlogs = filteredBlogs.filter((blog) =>
        blog.name.toLowerCase().includes(searchAuthor.toLowerCase())
      );
    }

    // Update currentBlogs with filtered result
    setCurrentBlogs(filteredBlogs);
  };

  return (
    <>
      <Header loggedIn={loggedIn} />

      <div className="container mx-auto mt-10">
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Search and Filter
          </h2>
          <div className="flex flex-col sm:flex-row w-full bg-white rounded-lg">
            <input
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none mb-2 sm:mb-0 sm:mr-2"
              type="text"
              placeholder="Insight Title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <input
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none mb-2 sm:mb-0 sm:mr-2"
              type="text"
              placeholder="Author Name"
              value={searchAuthor}
              onChange={(e) => setSearchAuthor(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-md transition-colors duration-300 ease-in-out"
              onClick={handleFilter}
            >
              Filter
            </button>
          </div>
        </div>
        {currentBlogs?.length > 0 ? (
          <div className="my-10 w-full">
            {currentBlogs.map((blog, index) => {
              return (
                <BlogCard
                  loggedIn={loggedIn}
                  key={index}
                  blog={blog}
                  user={user}
                />
              );
            })}
          </div>
        ) : (
          <p className="mt-10 text-gray-600 text-center text-lg font-medium">
            No insights available!
          </p>
        )}
      </div>
    </>
  );
}
