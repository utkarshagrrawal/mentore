import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "./global/header";

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
            let users = await fetch("http://localhost:3000/getcurrentuser", options);
            const result = await users.json();
            if (result.error) {
                navigate("/login");
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
            try {
                let options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                };
                let blogs = await fetch("http://localhost:3000/getallblogs", options);
                const response = await blogs.json();
                if (response.error) {
                    Swal.fire(
                        "Error",
                        "Some error occurred while fetching blogs",
                        "error"
                    );
                } else {
                    allBlogs.current = response.result;
                }
                setBlogsLoading(false);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        if (blogsLoading) {
            getBlogs();
        }
    }, [blogsLoading]);

    const handleLike = async (blogId) => {
        try {
            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ blogID: blogId }),
            };

            let response = await fetch("http://localhost:3000/like", options);
            let result = await response.json();

            if (result.success) {
                setBlogsLoading(true);
            } else {
                Swal.fire("Error", "Failed to like the blog", "error");
            }
        } catch (error) {
            console.error("Error liking blog:", error);
        }
    };

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
            <Header
                loggedIn={loggedIn}
            />

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
                    <div className="mx-16 w-full grid grid-cols-2">
                        {!blogsLoading &&
                            currentBlogs.map((blog, index) => (
                                <div
                                    key={index}
                                    className="mb-4 w-3/4 place-self-end col-span-2 rounded-lg border border-gray-200 bg-white p-4 shadow"
                                >
                                    <h3 className="mb-2 text-xl font-bold">{blog.title}</h3>
                                    <p className="mb-2 text-gray-600">By {blog.name}</p>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: blog.content,
                                        }}
                                        className="mb-2 max-h-16 overflow-hidden text-gray-700"
                                    ></div>
                                    <Link
                                        to={`/blog/${blog.id}`}
                                        className="text-blue-700 hover:underline"
                                    >
                                        View More
                                    </Link>
                                    {/* Like, Dislike, Comment section */}
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="flex items-center">
                                            {console.log(blog.liked_by)}
                                            {blog.liked_by &&
                                                blog.liked_by.includes(user.current.email) ? (
                                                <svg
                                                    className="hover:cursor-pointer"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={24}
                                                    height={24}
                                                    viewBox="0 0 24 24"
                                                    onClick={() => handleLike(blog.id)}
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14"
                                                    ></path>
                                                </svg>
                                            ) : (
                                                <svg
                                                    className="hover:cursor-pointer"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={24}
                                                    height={24}
                                                    viewBox="0 0 24 24"
                                                    onClick={() => handleLike(blog.id)}
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625zM15 12h-1v8h-4v-8H6.081L12 4.601L17.919 12z"
                                                    ></path>
                                                </svg>
                                            )}
                                            <span>{blog.liked_by?.length} Likes</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
