import React, { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import { ErrorNotify } from '../global/toast';


export default function Content({ blogId }) {
    const blog = useRef({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBlog = async () => {
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            };
            let users = await fetch(`https://mentore-ten.vercel.app/blog/${blogId}`, options);
            const result = await users.json();
            if (result.error) {
                ErrorNotify(result.error)
            } else {
                blog.current = result.result;
            }
            setLoading(false)
        };
        getBlog();
    }, [])

    return (
        !loading && (
            <div className="w-full">
                <div className="mb-10 sm:mx-16 mx-4 flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-semibold my-8 text-center text-gray-800">Title: {blog.current.title}</h1>
                    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
                        {parse(blog.current.content)}
                    </div>
                </div>
            </div>
        )
    )
}