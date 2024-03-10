import React from "react";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import { DismissToast, ErrorNotify, Loading } from "../global/toast";

export default function BlogCard({ index, blog, user, setBlogsLoading }) {
    const handleLike = async (blogId) => {
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ blogID: blogId }),
        };

        const toastId = Loading('Loading');
        let response = await fetch("http://localhost:3000/like", options);
        let result = await response.json();

        if (result.success) {
            setBlogsLoading(true);
        } else {
            ErrorNotify("Some error occurred while liking the blog");
        }
        DismissToast(toastId);
    };

    return (
        <div key={index} className="mb-4 w-3/4 place-self-end col-span-2 rounded-lg border border-gray-200 bg-white p-4 shadow">
            <h3 className="mb-2 text-xl font-bold">{blog.title}</h3>
            <p className="mb-2 text-gray-600">By {blog.name}</p>
            <div className="mb-2 max-h-16 overflow-hidden text-gray-700">
                {parse(blog.content)}
            </div>
            <Link to={`/blog/${blog.id}`} className="text-blue-700 hover:underline">
                View More
            </Link>
            {/* Like, Dislike, Comment section */}
            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center">
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
    )
}