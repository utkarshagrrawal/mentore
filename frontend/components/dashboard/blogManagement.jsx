import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorNotify } from "../global/toast";

const dateFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function BlogManagement({ blogsLoading, setBlogsLoading }) {
    const allBlogs = useRef([]);

    // get all blogs
    useEffect(() => {
        const getBlogs = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch('https://mentore-ten.vercel.app/mentor/blogs', options);
            const data = await response.json();
            if (data.error) {
                ErrorNotify(data.error)
            } else {
                allBlogs.current = data.result;
            }
            setBlogsLoading(false);
        }
        if (blogsLoading) {
            getBlogs();
        }
    }, [blogsLoading])

    const handleDelete = async (id) => {
        const response = confirm("Are you sure to want to delete this blog?");

        if (!response) {
            return ErrorNotify("Blog not deleted");
        }

        const deleteBlog = await fetch('https://mentore-ten.vercel.app/blog/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        const result = await deleteBlog.json();
        if (result.error) {
            ErrorNotify("Some error occured. Please try again")
        }

        setBlogsLoading(true);
    }

    return (
        <>
            <h1 className='text-center text-3xl font-bold my-4'>Manage blogs</h1>
            <div className='w-full'>
                <div className="relative overflow-x-auto mx-14 shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-blue-100 table-fixed">
                        <thead className="text-xs text-white uppercase bg-blue-600">
                            <tr className='text-center'>
                                <th scope="col" className="px-6 py-3">
                                    Posted on
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Link
                                </th>
                                <th scope="col" className='px-6 my-3'>
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!blogsLoading && allBlogs.current?.length > 0 ? allBlogs.current.map((item, id) => {
                                return (
                                    <tr key={id} className="text-center">
                                        <td className="px-6 py-4 text-black">
                                            {dateFormatter.format(new Date(item.created_at))}
                                        </td>
                                        <td className="px-6 py-4 text-black">
                                            {item.title}
                                        </td>
                                        <td className="px-6 py-4 text-black whitespace-pre-line">
                                            <Link to={`/blog/${item.id}`} className='border border-blue-500 duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm px-6 py-1'>View</Link>
                                        </td>
                                        <td className="px-6 py-4 text-black">
                                            <button className='border border-red-500 duration-150 hover:bg-red-700 focus:ring-2 focus:ring-red-500 hover:text-white font-medium rounded-lg text-sm px-6 py-1' onClick={() => handleDelete(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr className="text-center">
                                    <td colSpan='4' className="px-6 py-4 text-black">
                                        No blogs found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}