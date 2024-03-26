import React, { useState, useEffect, useRef } from 'react';
import { DismissToast, ErrorNotify, Loading, SuccessNotify } from '../global/toast';
import { FaReply } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { TbSend } from "react-icons/tb";
import { TiCancel } from "react-icons/ti";


export function createNestedAnswers(answers, parentId = null) {
    const nestedAnswers = [];
    for (const answer of answers) {
        if (answer.parent_answer_id === parentId) {
            const childAnswers = createNestedAnswers(answers, answer.answer_id);
            if (childAnswers.length > 0) {
                answer.child_answers = childAnswers;
            }
            nestedAnswers.push(answer);
        }
    }
    return nestedAnswers;
}


function Answer({ item, replyFields, handleReplyVisibility, handleDelete, handleLike, handleDislike, handleReplyText, handleReplyPost, user, dateFormatter, handleEditPost, handleEditText, handleEditVisibility, editFields }) {
    return (
        <>
            <div className="rounded-lg border border-slate-200">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-center justify-between px-4 py-2">
                    <div className="flex items-center">
                        <img src={item.gender ? "https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/male-avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbWFsZS1hdmF0YXIucG5nIiwiaWF0IjoxNzExMTg4ODM3LCJleHAiOjE3NDI3MjQ4Mzd9.qExdt9gnnYndht7-boBf9JR7TXV4f5r87clKZAZx3ZI&t=2024-03-23T10%3A13%3A57.836Z" : "https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/female-avatar.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvZmVtYWxlLWF2YXRhci5wbmciLCJpYXQiOjE3MTExODg4MDEsImV4cCI6MTc0MjcyNDgwMX0.SkW7zn8MTdTp2yQO3BousTpWQ3kBPQ2IT4wDLLKyamU&t=2024-03-23T10%3A13%3A21.412Z"} className="w-8 h-8 rounded-full" alt="User Avatar" />
                        <div className="ml-2 text-sm text-gray-600">
                            <p className="font-semibold text-blue-800">{item.answered_by_name}</p>
                            <p>on {dateFormatter.format(new Date(item.answered_at))}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center hover:cursor-pointer' onClick={() => handleReplyVisibility(item.answer_id)}>
                                {replyFields[item.answer_id]?.showReplyInput ? <TiCancel className="text-red-600" /> : <FaReply className="text-blue-600" />}
                                <span className={`ml-1 text-sm ${replyFields[item.answer_id]?.showReplyInput ? 'text-red-600' : 'text-blue-600'}`}>{replyFields[item.answer_id]?.showReplyInput ? 'Cancel reply' : 'Reply'}</span>
                            </div>
                            {user.email === item.user_email && (
                                <>
                                    <div className='hover:cursor-pointer flex items-center' onClick={() => handleDelete(item.answer_id)}>
                                        <MdDelete className="text-red-600" />
                                        <span className="text-sm text-red-600">Delete</span>
                                    </div>
                                    <div className='hover:cursor-pointer flex items-center' onClick={() => handleEditVisibility(item.answer_id)}>
                                        {editFields[item.answer_id]?.showEditInput ? <TiCancel className="text-red-600" /> : <FaEdit className="text-slate-700" />}
                                        <span className={`ml-1 text-sm ${editFields[item.answer_id]?.showEditInput ? 'text-red-600' : 'text-slate-700'}`}>{editFields[item.answer_id]?.showEditInput ? 'Cancel edit' : 'Edit'}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className='flex items-center'>
                            <div className="flex items-center">
                                {
                                    item.liked_by && item.liked_by.includes(user.email) ?
                                        (
                                            <svg className="hover:cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={24} height={24} strokeWidth={1.5} stroke="currentColor" onClick={() => handleLike(item.answer_id)}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                            </svg>
                                        ) : (
                                            <svg className="hover:cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={24} height={24} onClick={() => handleLike(item.answer_id)}>
                                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                            </svg>
                                        )
                                }
                                <span className="text-sm text-gray-600">{item.liked_by && item.liked_by.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    {editFields[item.answer_id]?.showEditInput ? (
                        <div className="mt-2 relative">
                            <input onChange={(event) => handleEditText(event, item.answer_id)} value={editFields[item.answer_id]?.editText || ''} className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none p-1 pr-[45px] resize-none duration-200" placeholder={item.answer} />
                            <button className="flex items-center text-white font-semibold p-1 rounded-lg transition duration-200 absolute top-0 right-0" onClick={() => handleEditPost(item.answer_id)}>
                                <TbSend className='text-2xl text-black hover:rotate-45 duration-200 hover:text-blue-500' title='Update answer' />
                            </button>
                        </div>
                    ) : (
                        <p className="text-base">{item.answer}</p>
                    )}
                </div>
                {(replyFields[item.answer_id]?.showReplyInput) && (
                    <div className="my-2 relative mx-4">
                        <input onChange={(event) => handleReplyText(event, item.answer_id)} value={replyFields[item.answer_id]?.replyText || ''} className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none p-1 pr-[45px] resize-none duration-200" placeholder="Enter reply here..." />
                        <button className="flex items-center text-white font-semibold p-1 rounded-lg transition duration-200 absolute top-0 right-0" onClick={() => handleReplyPost(item.answer_id)}>
                            <TbSend className='text-2xl text-black hover:rotate-45 duration-200 hover:text-blue-500' title='Post answer' />
                        </button>
                    </div>
                )}
            </div>
            {item.child_answers && item.child_answers.map((child, id) => {
                return (
                    <div key={id} className="pl-8 w-full mt-4 border-l-2">
                        <Answer item={child} replyFields={replyFields} handleReplyVisibility={handleReplyVisibility} handleDelete={handleDelete} handleLike={handleLike} handleDislike={handleDislike} handleReplyText={handleReplyText} handleReplyPost={handleReplyPost} user={user} dateFormatter={dateFormatter} handleEditPost={handleEditPost} handleEditText={handleEditText} handleEditVisibility={handleEditVisibility} editFields={editFields} />
                    </div>
                )
            })}
        </>
    )
}


export default function Answers({ questionId, user, setLoading, answers }) {
    const dateFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

    const [replyFields, setReplyFields] = useState({});
    const [editFields, setEditFields] = useState({});

    const handleLike = async (answer_id) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        }

        const toastId = Loading("Loading...");

        const response = await fetch("https://mentore-ten.vercel.app/question/" + questionId + "/answer/" + answer_id + "/like", options);
        const result = await response.json();

        DismissToast(toastId);

        if (result.error) {
            ErrorNotify(result.error)
        }
        setLoading(true);
    }

    const handleDelete = async (answer_id) => {
        const resp = confirm('Are you sure you want to delete this answer?');
        if (!resp) {
            return ErrorNotify("Answer not deleted");
        }
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        }
        const response = await fetch("https://mentore-ten.vercel.app/question/" + questionId + "/answer/" + answer_id, options);
        const result = await response.json();
        if (result.error) {
            ErrorNotify(result.error)
        } else {
            SuccessNotify("Answer deleted successfully")
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
        const response = await fetch("https://mentore-ten.vercel.app/question/" + questionId + "/answer/" + id + "/reply", options)
        const result = await response.json();

        DismissToast(toastId);

        if (result.error) {
            ErrorNotify(result.error)
        } else {
            SuccessNotify("Reply added successfully")
            setLoading(true);
        }
    }

    const handleEditVisibility = (answer_id) => {
        setEditFields(prevFields => {
            return {
                ...prevFields, [answer_id]: {
                    ...prevFields[answer_id],
                    showEditInput: !prevFields[answer_id]?.showEditInput,
                    editText: prevFields[answer_id]?.editText || '',
                }
            }
        })
    }

    const handleEditText = (event, answer_id) => {
        setEditFields(prevFields => {
            return {
                ...prevFields, [answer_id]: {
                    ...prevFields[answer_id],
                    editText: event.target.value,
                    showEditInput: true
                }
            }
        })
    }

    const handleEditPost = async (answer_id) => {
        const value = editFields[answer_id]?.editText || '';
        if (value === '') {
            return ErrorNotify("Answer cannot be empty")
        }
        if (value.trim() === '') {
            return ErrorNotify("Answer cannot be empty")
        }
        if (value.length > 1000) {
            return ErrorNotify("Answer should be less than 1000 characters")
        }

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify({
                answer: value
            })
        }

        const toastId = Loading("Updating answer...")

        const response = await fetch("https://mentore-ten.vercel.app/question/" + questionId + "/answer/" + answer_id, options);
        const result = await response.json();

        DismissToast(toastId);

        if (result.error) {
            ErrorNotify(result.error)
        } else {
            SuccessNotify("Answer updated successfully")
            setLoading(true);
        }
    }

    return (
        // answers?.map((item, id) => {
        //     return (
        //         <div className="w-full my-4" key={id}>
        //             <div className="sm:mx-16 mx-4 flex flex-col">
        //                 <Answer item={item} replyFields={replyFields} handleReplyVisibility={handleReplyVisibility} handleDelete={handleDelete} handleLike={handleLike} handleDislike={handleDislike} handleReplyText={handleReplyText} handleReplyPost={handleReplyPost} user={user} dateFormatter={dateFormatter} handleEditPost={handleEditPost} handleEditVisibility={handleEditVisibility} handleEditText={handleEditText} editFields={editFields} />
        //             </div>
        //         </div >
        //     )
        // })
        <></>
    )
}