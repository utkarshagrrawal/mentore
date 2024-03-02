import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import parse from 'html-react-parser';

export function Blog() {
    const user = useRef([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState({ loading: true, blogLoading: true });
    const [commentsLoading, setCommentsLoading] = useState(true);
    const blog = useRef({});
    const comments = useRef([]);
    const { id } = useParams();
    const navigate = useNavigate();

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
                navigate('/login');
                setLoggedIn(false);
            } else {
                user.current = result.result;
                setLoggedIn(true);
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        setLoading({ ...loading, blogLoading: true })
        const getBlog = async () => {
            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "blogID": id
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
            setLoading({ ...loading, blogLoading: false });
        };
        getBlog();
    }, [])

    useEffect(() => {
        const getComments = async () => {
            setCommentsLoading(true);
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }

            const response = await fetch("http://localhost:3000/getcomments/" + id, options);
            const result = await response.json();

            if (result.error) {
                Swal.fire(
                    'Error',
                    result.error,
                    'error'
                )
            } else {
                comments.current = result.result;
                console.log(result.result)
                setCommentsLoading(false);
            }
        }
        if (commentsLoading) {
            getComments();
        }
    }, [commentsLoading])

    const handleLogButton = () => {
        if (loggedIn) {
            return navigate('/profile')
        }
        navigate('/login')
    }

    const handlePost = async () => {
        const comments = document.getElementById('newComments');
        if (comments.value === '') {
            comments.focus();
            return Swal.fire(
                'Error',
                'Please enter a comment',
                'error'
            )
        } else if (comments.value.trim() === '') {
            comments.focus();
            return Swal.fire(
                'Error',
                'Please enter a comment',
                'error'
            )
        } else if (comments.value.length > 1000) {
            comments.focus();
            return Swal.fire(
                'Error',
                'Comment too long',
                'error'
            )
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

        const response = await fetch("http://localhost:3000/postcomment/" + id, options);
        const result = await response.json();
        if (result.error) {
            Swal.fire(
                'Error',
                result.error,
                'error'
            )
        } else {
            Swal.fire(
                'Success',
                result.result,
                'success'
            )
            setCommentsLoading(true);
        }
    }

    const handleLike = async (comment_id) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "commentID": comment_id,
            })
        }

        const response = await fetch("http://localhost:3000/addliketocomment", options);
        const result = await response.json();

        if (result.error) {
            Swal.fire(
                'Error',
                result.error,
                'error'
            )
        }
        setCommentsLoading(true);
    }

    const handleDislike = async (comment_id) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "commentID": comment_id,
            })
        }

        const response = await fetch("http://localhost:3000/adddisliketocomment", options);
        const result = await response.json();

        if (result.error) {
            Swal.fire(
                'Error',
                result.error,
                'error'
            )
        }
        setCommentsLoading(true);
    }

    return (
        <>
            <div className='w-full bg-[#d2d2d217]'>
                <div className='flex flex-wrap justify-center items-center md:justify-between lg:justify-between lg:mx-16 md:mx-16 my-3'>
                    <Link to='/'><img src="../static/logo.png" className="h-8 mix-blend-multiply" alt="Mentore" /></Link>
                    <input type='search' placeholder='Search for mentors' className='lg:w-[40rem] md:w-[26rem] w-[16rem] border-2 border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300' />
                    <button onClick={handleLogButton} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3'>{loggedIn ? 'Dashboard' : 'Login'}</button>
                </div>
            </div>
            <hr className='w-full' />
            {!loading.blogLoading ? (
                <div className="w-full">
                    <div className="mb-10 mx-16 flex flex-col items-center justify-center">
                        <h1 className="text-4xl font-semibold my-8 text-center text-gray-800">Title: {blog.current.title}</h1>
                        <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
                            {parse(blog.current.content)}
                        </div>
                    </div>
                </div>
            ) : null}
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
            {!commentsLoading && (
                comments.current && comments.current.map((item, id) => {
                    return (
                        <div className="w-full my-4" key={id}>
                            <div className="mx-16 grid grid-cols-12 gap-4">
                                <div className="col-span-12 relative bg-white rounded-lg shadow-md">
                                    <div className="flex items-center justify-between px-4 py-2">
                                        <div className="flex items-center">
                                            <img src={item.gender ? "../static/male-avatar.png" : "../static/female-avatar.png"} className="w-8 h-8 rounded-full" alt="User Avatar" />
                                            <div className="ml-2 text-sm text-gray-600">
                                                <p className="font-semibold text-blue-800">{item.user_name}</p>
                                                <p>on {new Date(item.time).toLocaleDateString() + " " + new Date(item.time).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
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
                                                <span className="ml-1 text-sm text-gray-600">{item.liked_by && item.liked_by.length}</span>
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
                                                <span className="ml-1 text-sm text-gray-600">{item.disliked_by && item.disliked_by.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-base">{item.comment}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    )
                })
            )}
        </>
    )
}