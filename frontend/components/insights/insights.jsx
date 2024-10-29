import React, { useRef, useState, useEffect } from "react";
import { ErrorNotify } from "../global/toast";
import Header from "../global/header";
import BlogCard from "./insightCard";

import EmptyInsightsPage from "./emptyInsightsPage";

export function Insights() {
  const user = useRef([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10);
  const allBlogs = useRef([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [currentBlogs, setCurrentBlogs] = useState([]);

  // checks if the user is logged in
  useEffect(() => {
    const getUser = async () => {
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      };
      let users = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/user/details",
        options
      );
      const result = await users.json();
      if (result.error) {
        localStorage.removeItem("token");
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
      setBlogsLoading(true);
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      };
      let blogs = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/blog/all",
        options
      );
      const response = await blogs.json();
      if (response.error) {
        ErrorNotify("Some error occurred while fetching blogs");
      } else {
        allBlogs.current = response.result;
        setCurrentBlogs(
          allBlogs.current.slice(indexOfFirstBlog, indexOfLastBlog)
        );
      }
      setBlogsLoading(false);
    };
    if (blogsLoading) {
      getBlogs();
    }
  }, [blogsLoading]);

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;

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
    <div className="flex min-h-screen w-full flex-col items-center">
      <Header loggedIn={loggedIn} />

      <div className="w-full mt-10">
        <div className="my-3 flex flex-row w-full flex-wrap items-center">
          {!blogsLoading ? (
            <div className="w-full">
              <div className="mx-4 sm:mx-16 flex flex-col items-center mb-10">
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
            </div>
          ) : (
            <></>
          )}
          {!blogsLoading && currentBlogs?.length > 0 ? (
            <div className="sm:mx-16 mx-4 w-full">
              {currentBlogs.map((blog, index) => {
                return (
                  <BlogCard
                    loggedIn={loggedIn}
                    key={index}
                    blog={blog}
                    user={user}
                    setBlogsLoading={setBlogsLoading}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyInsightsPage />
          )}
        </div>
      </div>
    </div>
  );
}
