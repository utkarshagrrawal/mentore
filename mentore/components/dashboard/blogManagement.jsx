import React, { useEffect, useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { TINY_MCE_API_KEY } from '../../src/assets/credentials';
import { Link } from "react-router-dom";
import { DismissToast, ErrorNotify, Loading, SuccessNotify } from "../global/toast";
import Swal from "sweetalert2";

const dateFormatter = Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function BlogManagement() {
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [blogBtnText, setBlogBtnText] = useState('Create blog');
    const [blogTitle, setBlogTitle] = useState('');
    const allBlogs = useRef([]);
    const editorRef = useRef(null);

    // get all blogs
    useEffect(() => {
        const getBlogs = async () => {
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            const response = await fetch('http://localhost:3000/mentor/blogs', options);
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
        const response = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })

        if (!response.isConfirmed) {
            return Swal.fire({
                title: 'Cancelled',
                text: 'The blog was not deleted',
                icon: 'info'
            })
        }

        const deleteBlog = await fetch('http://localhost:3000/blog/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const result = await deleteBlog.json();
        if (result.error) {
            ErrorNotify(result.error)
        }

        setBlogsLoading(true);
    }

    const handleCreateBlogBtn = () => {
        if (blogBtnText === 'Create blog') {
            setBlogBtnText('Cancel creation')
        } else {
            setBlogBtnText('Create blog')
        }
    }

    const handleChange = (e) => {
        setBlogTitle(e.target.value);
    }

    // creates a blog
    const handlePublish = async () => {
        const content = editorRef.current && editorRef.current.getContent();
        if (content === '') {
            ErrorNotify('Please enter content for the blog');
            return;
        }
        if (blogTitle === '') {
            ErrorNotify('Please enter a valid title for the blog');
            return;
        }
        if (blogTitle.trim() === '') {
            ErrorNotify('Please enter a valid title for the blog');
            return;
        }

        const toastId = Loading('Creating blog...');
        const createBlog = await fetch('http://localhost:3000/blog/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: blogTitle,
                content: content
            })
        })
        const response = await createBlog.json();
        if (response.error) {
            ErrorNotify(response.error);
        } else {
            SuccessNotify(response.success);
        }
        DismissToast(toastId);
        setBlogsLoading(true);
    }

    return (
        <>
            <h1 className='text-center text-3xl font-bold my-4'>Manage blogs</h1>
            <div className='w-full'>
                <div className="relative overflow-x-auto mx-14 shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-blue-100 table-fixed">
                        <thead className="text-xs text-slate-600 uppercase bg-blue-100">
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
            <div className='flex w-full mb-8 mt-4 px-14 justify-end'>
                <button onClick={handleCreateBlogBtn} className='border-[0.1rem] bg-[#fdc113] focus:ring-2 focus:ring-black text-black font-medium rounded-lg text-sm px-8 py-1 w-full'>{blogBtnText}</button>
            </div>

            {
                (blogBtnText === 'Cancel creation') ? (
                    <div className='w-full mb-8'>
                        <div className='flex flex-col mx-16 p-4 rounded-lg border-[0.01rem] border-black bg-blue-50'>
                            <div className='w-1/2'>
                                <h1 className='font-bold my-4'>Title</h1>
                                <input onChange={handleChange} value={blogTitle} type='text' className='w-full p-2 border border-blue-400 rounded-md mb-4' />
                            </div>
                            <Editor
                                apiKey={TINY_MCE_API_KEY}
                                onInit={(evt, editor) => editorRef.current = editor}
                                initialValue="<p>This is the initial content of the editor.</p>"
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat | help',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                            />
                            <button onClick={handlePublish} className='border border-black duration-150 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 hover:text-white font-medium rounded-lg text-sm px-6 py-2 my-4 place-self-end w-1/7'>Publish</button>
                        </div>
                    </div>
                ) : null
            }
        </>
    )
}