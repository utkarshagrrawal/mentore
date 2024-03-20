import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const [blogsLoading, setBlogsLoading] = useState(true);

    // checks if the user is logged in
    useEffect(() => {
        const getUser = async () => {
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            let users = await fetch("http://localhost:3000/user/details", options);
            const result = await users.json();
            if (result.error) {
                navigate("/user/login");
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
                },
            };
            let blogs = await fetch("http://localhost:3000/blog/all", options);
            const response = await blogs.json();
            if (response.error) {
                ErrorNotify("Some error occurred while fetching blogs")
            } else {
                allBlogs.current = response.result;
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
    const currentBlogs = allBlogs.current.slice(
        indexOfFirstBlog,
        indexOfLastBlog
    );

    return (
        <div className="flex min-h-screen w-full flex-col items-center">
            {/* Header Section */}
            <Header loggedIn={loggedIn} />

            {/* Main Content Section */}
            <div className="w-full">
                <div className="mx-16 my-3 flex flex-wrap items-center justify-center">
                    <h1 className="mr-16 text-4xl font-bold">Insights</h1>
                </div>
                <div className="my-3 flex w-full flex-wrap items-center justify-center">
                    {/* Left 1/4 for sorting options (you can customize this part) */}
                    <div className="mx-16 w-[25%] grid grid-cols-1">
                        {/* Add sorting options here */}
                    </div>

                    {/* Right 3/4 for blog cards */}

                    {!blogsLoading && currentBlogs?.length > 0 ? (
                        <div className="mx-16 w-full grid grid-cols-2">
                            {currentBlogs.map((blog, index) => {
                                <BlogCard key={index} blog={blog} user={user} setBlogsLoading={setBlogsLoading} />
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
