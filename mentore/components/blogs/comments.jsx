import React, { useState, useEffect, useRef } from 'react';
import { ErrorNotify, SuccessNotify } from '../global/toast';
import { FaReply } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


export default function Comments({ blogId, user }) {
    const dateFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

    const [loading, setLoading] = useState(true);
    const [replyFields, setReplyFields] = useState({});
    const comments = useRef([]);


    useEffect(() => {
        const getComments = async () => {
            setLoading(true);
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }

            const response = await fetch("http://localhost:3000/blog/" + blogId + "/comments", options);
            const result = await response.json();

            if (result.error) {
                ErrorNotify(result.error)
            } else {
                comments.current = result.result;
                setLoading(false);
            }
        }
        if (loading) {
            getComments();
        }
    }, [loading])

    const handlePost = async () => {
        const comments = document.getElementById('newComments');
        if (comments.value === '') {
            comments.focus();
            return ErrorNotify("Comment cannot be empty")
        } else if (comments.value.trim() === '') {
            comments.focus();
            return ErrorNotify("Comment cannot be empty")
        } else if (comments.value.length > 1000) {
            comments.focus();
            return ErrorNotify("Comment should be less than 1000 characters")
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "comment": comments.value
            })
        };

        const response = await fetch("http://localhost:3000/blog/" + blogId + "/comment", options);
        const result = await response.json();
        if (result.error) {
            ErrorNotify(result.error)
        } else {
            SuccessNotify("Comment added successfully!")
        }
        setLoading(true);
    }

    const handleLike = async (comment_id) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        }

        const response = await fetch("http://localhost:3000/blog/" + blogId + "/comment/" + comment_id + "/like", options);
        const result = await response.json();

        if (result.error) {
            ErrorNotify(result.error)
        }
        setLoading(true);
    }

    const handleDislike = async (comment_id) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        }

        const response = await fetch("http://localhost:3000/blog/" + blogId + "/comment/" + comment_id + "/dislike", options);
        const result = await response.json();

        if (result.error) {
            ErrorNotify(result.error)
        }
        setLoading(true);
    }

    const handleDelete = async (commentId) => {
        const resp = confirm('Are you sure you want to delete this comment?');
        if (!resp) {
            return ErrorNotify("Comment not deleted");
        }
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        }
        const response = await fetch("http://localhost:3000/blog/" + blogId + "/comment/" + commentId, options);
        const result = await response.json();
        if (result.error) {
            ErrorNotify(result.error)
        } else {
            SuccessNotify("Comment deleted successfully")
        }
        setLoading(true);
    }

    const handleReply = (id) => {
        setReplyFields(prevFields => {
            return {
                ...prevFields, [id]: {
                    ...prevFields[id],
                    showReplyInput: !prevFields[id]?.showReplyInput,
                    replyText: ''
                }
            }
        })
    }

    return (
        <>
            <div className="w-full text-center my-10">
                <span className="text-3xl font-bold">Discussion</span>
                <div className="mx-16 mt-4 gap-2 grid grid-cols-12 place-items-center">
                    <div className="col-span-12 md:col-span-11 w-full">
                        <textarea id="newComments" className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none p-3 resize-none duration-200" placeholder="Enter your thoughts here..."></textarea>
                    </div>
                    <div className="col-span-12 md:col-span-1 w-full mt-4 md:mt-0">
                        <button className="bg-blue-500 hover:bg-blue-600 flex items-center text-white font-semibold py-2 px-4 border border-blue-500 rounded-lg transition duration-200" onClick={handlePost}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 inline-block mr-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                            Post
                        </button>
                    </div>
                </div>
            </div>
            {!loading && (
                comments?.current?.map((item, id) => {
                    return (
                        <div className="w-full my-4" key={id}>
                            <div className="mx-16 grid grid-cols-12 gap-4">
                                <div className="col-span-12 relative bg-white rounded-lg shadow-md">
                                    <div className="flex items-center justify-between px-4 py-2">
                                        <div className="flex items-center">
                                            <img src={item.gender ? "../static/male-avatar.png" : "../static/female-avatar.png"} className="w-8 h-8 rounded-full" alt="User Avatar" />
                                            <div className="ml-2 text-sm text-gray-600">
                                                <p className="font-semibold text-blue-800">{item.user_name}</p>
                                                <p>on {dateFormatter.format(new Date(item.time))}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className='flex items-center gap-2'>
                                                <div className='flex items-center hover:cursor-pointer'>
                                                    <FaReply className="text-blue-600" />
                                                    <span className="ml-1 text-sm text-blue-600">Reply</span>
                                                </div>
                                                {user.current.email === item.user_email && (
                                                    <>
                                                        <div className='flex items-center' onClick={() => handleDelete(item.comment_id)}>
                                                            <MdDelete className="hover:cursor-pointer text-red-600" />
                                                            <span className="hover:cursor-pointer text-sm text-red-600">Delete</span>
                                                        </div>
                                                        <div className='flex items-center'>
                                                            <FaEdit className="hover:cursor-pointer text-slate-700" />
                                                            <span className="ml-1 text-sm text-slate-700">Edit</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className='flex items-center'>
                                                <div className="flex items-center">
                                                    {
                                                        item.liked_by && item.liked_by.includes(user.current.email) ?
                                                            (
                                                                <svg className="hover:cursor-pointer" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" onClick={() => handleLike(item.comment_id)}>
                                                                    <path fill="currentColor" d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg className="hover:cursor-pointer" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" onClick={() => handleLike(item.comment_id)}>
                                                                    <path fill="currentColor" d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625zM15 12h-1v8h-4v-8H6.081L12 4.601L17.919 12z"></path>
                                                                </svg>
                                                            )
                                                    }
                                                    <span className="text-sm text-gray-600">{item.liked_by && item.liked_by.length}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    {
                                                        item.disliked_by && item.disliked_by.includes(user.current.email) ?
                                                            (
                                                                <svg className="hover:cursor-pointer" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" onClick={() => handleDislike(item.comment_id)}>
                                                                    <path fill="currentColor" d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg className="hover:cursor-pointer" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" onClick={() => handleDislike(item.comment_id)}>
                                                                    <path fill="currentColor" d="M20.901 10.566A1.001 1.001 0 0 0 20 10h-4V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H4a1.001 1.001 0 0 0-.781 1.625l8 10a1 1 0 0 0 1.562 0l8-10c.24-.301.286-.712.12-1.059M12 19.399L6.081 12H10V4h4v8h3.919z"></path>
                                                                </svg>
                                                            )
                                                    }
                                                    <span className="text-sm text-gray-600">{item.disliked_by && item.disliked_by.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-base">{item.comment}</p>
                                    </div>
                                    {/* {(replyFields?.comment_id?.showReplyInput && item.comment_id === replyFields?.comment_id) && (
                                        <div className='flex items-center p-4'>
                                            HI sir
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    )
                })
            )}
        </>
    )
}