import React, { useState, useEffect, useRef } from 'react';
import { DismissToast, ErrorNotify, Loading, SuccessNotify } from '../global/toast';
import { FaReply } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { TbSend } from "react-icons/tb";
import { TiCancel } from "react-icons/ti";


function createNestedComments(comments, parentId = null) {
    const nestedComments = [];
    for (const comment of comments) {
        if (comment.parent_comment_id === parentId) {
            const childComments = createNestedComments(comments, comment.comment_id);
            if (childComments.length > 0) {
                comment.child_comments = childComments;
            }
            nestedComments.push(comment);
        }
    }
    return nestedComments;
}


function Comment({ item, replyFields, handleReplyVisibility, handleDelete, handleLike, handleDislike, handleReplyText, handleReplyPost, user, dateFormatter, handleEditPost, handleEditText, handleEditVisibility, editFields }) {
    return (
        <>
            <div className="rounded-lg border border-slate-200">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between px-4 py-2">
                    <div className="flex items-center">
                        <img src={item.gender ? "https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/male-avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbWFsZS1hdmF0YXIucG5nIiwiaWF0IjoxNzExMTg4ODM3LCJleHAiOjE3NDI3MjQ4Mzd9.qExdt9gnnYndht7-boBf9JR7TXV4f5r87clKZAZx3ZI&t=2024-03-23T10%3A13%3A57.836Z" : "https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/female-avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvZmVtYWxlLWF2YXRhci5wbmciLCJpYXQiOjE3MTExODg4MDEsImV4cCI6MTc0MjcyNDgwMX0.SkW7zn8MTdTp2yQO3BousTpWQ3kBPQ2IT4wDLLKyamU&t=2024-03-23T10%3A13%3A21.412Z"} className="w-8 h-8 rounded-full" alt="User Avatar" />
                        <div className="ml-2 text-sm text-gray-600">
                            <p className="font-semibold text-blue-800">{item.user_name}</p>
                            <p>on {dateFormatter.format(new Date(item.time))}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center hover:cursor-pointer' onClick={() => handleReplyVisibility(item.comment_id)}>
                                {replyFields[item.comment_id]?.showReplyInput ? <TiCancel className="text-red-600" /> : <FaReply className="text-blue-600" />}
                                <span className={`ml-1 text-sm ${replyFields[item.comment_id]?.showReplyInput ? 'text-red-600' : 'text-blue-600'}`}>{replyFields[item.comment_id]?.showReplyInput ? 'Cancel reply' : 'Reply'}</span>
                            </div>
                            {user.current.email === item.user_email && (
                                <>
                                    <div className='hover:cursor-pointer flex items-center' onClick={() => handleDelete(item.comment_id)}>
                                        <MdDelete className="text-red-600" />
                                        <span className="text-sm text-red-600">Delete</span>
                                    </div>
                                    <div className='hover:cursor-pointer flex items-center' onClick={() => handleEditVisibility(item.comment_id)}>
                                        {editFields[item.comment_id]?.showEditInput ? <TiCancel className="text-red-600" /> : <CiEdit className="text-slate-700" />}
                                        <span className={`ml-1 text-sm ${editFields[item.comment_id]?.showEditInput ? 'text-red-600' : 'text-slate-700'}`}>{editFields[item.comment_id]?.showEditInput ? 'Cancel edit' : 'Edit'}</span>
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
                            </div>
                            <span className={`text-sm font-semibold ${item.liked_by.length - item.disliked_by.length >= 0 ? 'text-blue-500' : 'text-red-500'}`}>{item.liked_by && item.disliked_by && (item.liked_by.length - item.disliked_by.length)}</span>
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
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    {editFields[item.comment_id]?.showEditInput ? (
                        <div className="mt-2 relative">
                            <input onChange={(event) => handleEditText(event, item.comment_id)} value={editFields[item.comment_id]?.editText || ''} className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none p-1 pr-[45px] resize-none duration-200" placeholder={item.comment} />
                            <button className="flex items-center text-white font-semibold p-1 rounded-lg transition duration-200 absolute top-0 right-0" onClick={() => handleEditPost(item.comment_id)}>
                                <TbSend className='text-2xl text-black hover:rotate-45 duration-200 hover:text-blue-500' title='Update comment' />
                            </button>
                        </div>
                    ) : (
                        <p className="text-base">{item.comment}</p>
                    )}
                </div>
                {(replyFields[item.comment_id]?.showReplyInput) && (
                    <div className="my-2 relative mx-4">
                        <input onChange={(event) => handleReplyText(event, item.comment_id)} value={replyFields[item.comment_id]?.replyText || ''} className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none p-1 pr-[45px] resize-none duration-200" placeholder="Enter reply here..." />
                        <button className="flex items-center text-white font-semibold p-1 rounded-lg transition duration-200 absolute top-0 right-0" onClick={() => handleReplyPost(item.comment_id)}>
                            <TbSend className='text-2xl text-black hover:rotate-45 duration-200 hover:text-blue-500' title='Post comment' />
                        </button>
                    </div>
                )}
            </div>
            {item.child_comments && item.child_comments.map((child, id) => {
                return (
                    <div key={id} className="pl-8 w-full mt-4 border-l-2">
                        <Comment item={child} replyFields={replyFields} handleReplyVisibility={handleReplyVisibility} handleDelete={handleDelete} handleLike={handleLike} handleDislike={handleDislike} handleReplyText={handleReplyText} handleReplyPost={handleReplyPost} user={user} dateFormatter={dateFormatter} handleEditPost={handleEditPost} handleEditText={handleEditText} handleEditVisibility={handleEditVisibility} editFields={editFields} />
                    </div>
                )
            })}
        </>
    )
}


export default function Comments({ blogId, user }) {
    const dateFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

    const [loading, setLoading] = useState(true);
    const [replyFields, setReplyFields] = useState({});
    const [editFields, setEditFields] = useState({});
    const [commenting, setCommenting] = useState(false);
    const comments = useRef([]);
    const [newComment, setNewComment] = useState('');

    const handleChange = (e) => {
        setNewComment(e.target.value);
    }

    useEffect(() => {
        const getComments = async () => {
            setLoading(true);
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                },
            }

            const response = await fetch("https://mentore-backend.vercel.app/blog/" + blogId + "/comments", options);
            const result = await response.json();

            if (result.error) {
                ErrorNotify("Some error occured. Please try again")
            } else {
                comments.current = createNestedComments(result.result)
                setReplyFields(result.result.map(item => {
                    return {
                        [item.comment_id]: {
                            showReplyInput: false,
                            replyText: ''
                        }
                    }
                }))
                setEditFields(result.result.map(item => {
                    return {
                        [item.comment_id]: {
                            showEditInput: false,
                            editText: item.comment
                        }
                    }
                }))
                setLoading(false);
            }
        }
        if (loading) {
            getComments();
        }
    }, [loading])

    const handlePost = async () => {
        if (newComment === '') {
            return ErrorNotify("Comment cannot be empty")
        } else if (newComment.trim() === '') {
            return ErrorNotify("Comment cannot be empty")
        } else if (newComment.length > 1000) {
            return ErrorNotify("Comment should be less than 1000 characters")
        }

        setCommenting(true);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify({
                "comment": newComment
            })
        };

        const response = await fetch("https://mentore-backend.vercel.app/blog/" + blogId + "/comment", options);
        const result = await response.json();
        if (result.error) {
            ErrorNotify("Some error occured. Please try again")
        } else {
            SuccessNotify("Comment added successfully!")
        }
        setLoading(true);
        setNewComment('');
        setCommenting(false);
    }

    const handleLike = async (comment_id) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        }

        const toastId = Loading("Loading...");

        const response = await fetch("https://mentore-backend.vercel.app/blog/" + blogId + "/comment/" + comment_id + "/like", options);
        const result = await response.json();

        DismissToast(toastId);

        if (result.error) {
            ErrorNotify("Some error occured. Please try again")
        }
        setLoading(true);
    }

    const handleDislike = async (comment_id) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        }

        const toastId = Loading("Loading...");

        const response = await fetch("https://mentore-backend.vercel.app/blog/" + blogId + "/comment/" + comment_id + "/dislike", options);
        const result = await response.json();

        DismissToast(toastId);

        if (result.error) {
            ErrorNotify("Some error occured. Please try again")
        }
        setLoading(true);
    }

    const handleDelete = async (commentId) => {
        const resp = confirm('Are you sure you want to delete this comment?');
        if (!resp) {
            return ErrorNotify("Comment not deleted");
        }
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        }
        const response = await fetch("https://mentore-backend.vercel.app/blog/" + blogId + "/comment/" + commentId, options);
        const result = await response.json();
        if (result.error) {
            ErrorNotify("Some error occured. Please try again")
        } else {
            SuccessNotify("Comment deleted successfully")
        }
        setLoading(true);
    }

    const handleReplyVisibility = (id) => {
        setReplyFields(prevFields => {
            return {
                ...prevFields, [id]: {
                    ...prevFields[id],
                    showReplyInput: !prevFields[id]?.showReplyInput,
                }
            }
        })
    }

    const handleReplyText = (event, id) => {
        setReplyFields(prevFields => {
            return {
                ...prevFields, [id]: {
                    ...prevFields[id],
                    replyText: event.target.value
                }
            }
        })
    }

    const handleReplyPost = async (id) => {
        const value = replyFields[id]?.replyText || '';
        if (value === '') {
            return ErrorNotify("Reply cannot be empty")
        }
        if (value.trim() === '') {
            return ErrorNotify("Reply cannot be empty")
        }

        const toastId = Loading("Adding reply...")

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify({
                "reply": value
            })
        }
        const response = await fetch("https://mentore-backend.vercel.app/blog/" + blogId + "/comment/" + id + "/reply", options)
        const result = await response.json();

        DismissToast(toastId);

        if (result.error) {
            ErrorNotify("Some error occured. Please try again")
        } else {
            SuccessNotify("Reply added successfully")
            setLoading(true);
        }
    }

    const handleEditVisibility = (comment_id) => {
        setEditFields(prevFields => {
            return {
                ...prevFields, [comment_id]: {
                    ...prevFields[comment_id],
                    showEditInput: !prevFields[comment_id]?.showEditInput,
                    editText: prevFields[comment_id]?.editText || '',
                }
            }
        })
    }

    const handleEditText = (event, comment_id) => {
        setEditFields(prevFields => {
            return {
                ...prevFields, [comment_id]: {
                    ...prevFields[comment_id],
                    editText: event.target.value,
                    showEditInput: true
                }
            }
        })
    }

    const handleEditPost = async (comment_id) => {
        const value = editFields[comment_id]?.editText || '';
        if (value === '') {
            return ErrorNotify("Comment cannot be empty")
        }
        if (value.trim() === '') {
            return ErrorNotify("Comment cannot be empty")
        }
        if (value.length > 1000) {
            return ErrorNotify("Comment should be less than 1000 characters")
        }

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify({
                "comment": value
            })
        }

        const toastId = Loading("Updating comment...")

        const response = await fetch("https://mentore-backend.vercel.app/blog/" + blogId + "/comment/" + comment_id, options);
        const result = await response.json();

        DismissToast(toastId);

        if (result.error) {
            ErrorNotify("Some error occured. Please try again")
        } else {
            SuccessNotify("Comment updated successfully")
            setLoading(true);
        }
    }

    return (
        <>
            <div className="w-full text-center my-10">
                <div className="sm:mx-16 mx-4 mt-10 p-6 border rounded-lg shadow-md">
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500"
                        rows="4"
                        placeholder="Publish your thoughts from here..."
                        value={newComment}
                        onChange={handleChange}
                        required
                    ></textarea>
                    <button
                        type="submit"
                        onClick={handlePost}
                        disabled={commenting}
                        className="mt-4 w-full bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 flex justify-center"
                    >
                        {
                            commenting ? (
                                <div className="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-blue-600" />
                            ) : (
                                "Post Comment"
                            )
                        }
                    </button>
                </div>
            </div>
            {!loading && (
                comments?.current?.map((item, id) => {
                    return (
                        <div className="w-full my-4" key={id}>
                            <div className="sm:mx-16 mx-4 flex flex-col">
                                <Comment item={item} replyFields={replyFields} handleReplyVisibility={handleReplyVisibility} handleDelete={handleDelete} handleLike={handleLike} handleDislike={handleDislike} handleReplyText={handleReplyText} handleReplyPost={handleReplyPost} user={user} dateFormatter={dateFormatter} handleEditPost={handleEditPost} handleEditVisibility={handleEditVisibility} handleEditText={handleEditText} editFields={editFields} />
                            </div>
                        </div >
                    )
                })
            )}
        </>
    )
}