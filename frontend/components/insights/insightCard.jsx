import React from "react";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import { DismissToast, ErrorNotify, Loading } from "../global/toast";

export default function BlogCard({ blog, user, setBlogsLoading }) {
    const dateTimeFormatter = Intl.DateTimeFormat(undefined, { timeStyle: "short", dateStyle: "medium" })

    const handleLike = async (blogId) => {
        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            },
        };

        const toastId = Loading('Loading');
        let response = await fetch("https://mentore-backend.vercel.app//blog/" + blogId + "/like", options);
        let result = await response.json();

        if (result.success) {
            setBlogsLoading(true);
        } else {
            ErrorNotify("Some error occurred while liking the blog");
        }
        DismissToast(toastId);
    };

    return (
        <div className="mb-8 w-full place-self-end col-span-2 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex justify-between flex-col sm:flex-row">
                <div className="overflow-hidden hover:overflow-visible">
                    <h3 className="mb-2 text-2xl font-bold text-gray-800">{blog.title}</h3>
                    <p className="mb-2 text-gray-600">By {blog.name}</p>
                </div>
                <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-800">Posted on: {dateTimeFormatter.format(new Date(blog.created_at))}</h3>
                </div>
            </div>
            <div className="mb-4 h-24 overflow-hidden">
                {parse(blog.content)}
            </div>
            <Link to={`/blog/${blog.id}`} className="block text-blue-700 hover:underline">
                Read More
            </Link>
            <div className="mt-4 flex items-center justify-between">
                <div className={`flex items-center border px-3 rounded-full ${blog.liked_by.includes(user.current.email) && 'bg-red-50'}`}>
                    <button
                        onClick={() => handleLike(blog.id)}
                        className={`flex items-center w-8 h-8 ${blog.liked_by && blog.liked_by.includes(user.current.email) ? "text-red-500" : "text-gray-500"}`}
                    >
                        {blog.liked_by?.length > 0 && blog.liked_by.includes(user.current.email) ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={24} height={24} className="w-6 h-6">
                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width={24} height={24} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        )}
                    </button>
                    <span className={`${blog.liked_by.includes(user.current.email) ? 'text-black' : 'text-gray-600'}`}>{blog.liked_by?.length} Likes</span>
                </div>
            </div>
        </div>
    )
}