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
                    "Authorization": localStorage.getItem("token"),
                },
            };
            let users = await fetch("https://mentore-ten.vercel.app/user/details", options);
            const result = await users.json();
            if (result.error) {
                localStorage.removeItem('token');
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
                    "Authorization": localStorage.getItem("token"),
                },
            };
            let blogs = await fetch("https://mentore-ten.vercel.app/blog/all", options);
            const response = await blogs.json();
            if (response.error) {
                ErrorNotify("Some error occurred while fetching blogs")
            } else {
                allBlogs.current = response.result;
                setCurrentBlogs(allBlogs.current.slice(
                    indexOfFirstBlog,
                    indexOfLastBlog
                )
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
    // const currentBlogs = allBlogs.current.slice(
    //     indexOfFirstBlog,
    //     indexOfLastBlog
    // );

    const handleFilter = () => {
        let filteredBlogs = allBlogs.current;

        // Filter by title if searchTitle is not empty
        if (searchTitle.trim() !== "") {
            filteredBlogs = filteredBlogs.filter(blog =>
                blog.title.toLowerCase().includes(searchTitle.toLowerCase())
            );
        }

        // Filter by author if searchAuthor is not empty
        if (searchAuthor.trim() !== "") {
            filteredBlogs = filteredBlogs.filter(blog =>
                blog.name.toLowerCase().includes(searchAuthor.toLowerCase())
            );
        }

        // Update currentBlogs with filtered result
        setCurrentBlogs(filteredBlogs);
    }

    return (
        <div className="flex min-h-screen w-full flex-col items-center">
            {/* Header Section */}
            <Header loggedIn={loggedIn} />

            {/* Main Content Section */}
            <div className="w-full mt-10">
                <div className="my-3 flex flex-row w-full flex-wrap items-center ">
                    {/* Left 1/4 for sorting options (you can customize this part) */}
                    <div className="flex flex-col w-1/4 items-center">
                        {/* Add sorting options here */}
                        <input className="m-2 w-3/4 border border-black p-1" type="text" placeholder="Insight Title" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
                        <input className="m-2 w-3/4 border border-black p-1" type="text" placeholder="Author Name" value={searchAuthor} onChange={(e) => setSearchAuthor(e.target.value)} />
                        <button className="bg-blue-500 text-white m-2 w-3/4 p-1" onClick={handleFilter}>Filter</button>
                    </div>

                    {/* Right 3/4 for blog cards */}
                    <div className="flex w-3/4">
                    {!blogsLoading && currentBlogs?.length > 0 ? (
                        <div className="mx-16 w-full flex">
                            {currentBlogs.map((blog, index) => {
                                return (
                                    <BlogCard key={index} blog={blog} user={user} setBlogsLoading={setBlogsLoading} />
                                )
                            })}
                        </div>
                    ) : (
                        <EmptyInsightsPage />
                    )}

                    </div>
                    
                </div>
            </div>
        </div>
    );
}
