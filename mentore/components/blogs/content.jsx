import React, { useState, useEffect, useRef } from 'react';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';


export default function Content({ blogId }) {
    const blog = useRef({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBlog = async () => {
            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "blogID": blogId
                })
            };
            let users = await fetch("http://localhost:3000/getcurrentblog", options);
            const result = await users.json();
            if (result.error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: result.error
                })
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
                <div className="mb-10 mx-16 flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-semibold my-8 text-center text-gray-800">Title: {blog.current.title}</h1>
                    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
                        {parse(blog.current.content)}
                    </div>
                </div>
            </div>
        )
    )
}