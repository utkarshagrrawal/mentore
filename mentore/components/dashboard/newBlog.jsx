import React, { useEffect, useRef, useState } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { DismissToast, ErrorNotify, Loading, SuccessNotify } from "../global/toast";


export default function NewBlog({ setBlogsLoading }) {
    const [blogBtnText, setBlogBtnText] = useState('Create blog');
    const [TINY_MCE_API_KEY, setTINY_MCE_API_KEY] = useState('');
    const [blogTitle, setBlogTitle] = useState('');
    const editorRef = useRef(null);

    const handleCreateBlogBtn = () => {
        if (blogBtnText === 'Create blog') {
            setBlogBtnText('Cancel creation')
        } else {
            setBlogBtnText('Create blog')
        }
    }

    useEffect(() => {
        const getApiKey = async () => {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                }
            }

            const response = await fetch('https://mentore-ten.vercel.app/blog/editorkey', options);
            const result = await response.json();
            if (result.key) {
                setTINY_MCE_API_KEY(result.key);
            }
        }
        if (TINY_MCE_API_KEY === '') {
            getApiKey();
        }
    }, [])

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
        const createBlog = await fetch('https://mentore-ten.vercel.app/blog/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify({
                title: blogTitle,
                content: content
            })
        })
        const response = await createBlog.json();
        DismissToast(toastId);
        if (response.error) {
            ErrorNotify(response.error);
        } else {
            SuccessNotify("Blog created successfully");
        }
        setBlogsLoading(true);
    }

    return (
        <div className='flex flex-col w-full mb-8 mt-4 px-14'>
            <div onClick={handleCreateBlogBtn} className='text-center bg-yellow-400 focus:ring-2 focus:ring-black text-slate-[850] font-medium rounded-t-lg text-sm px-8 py-2'>{blogBtnText}</div>
            {
                (blogBtnText === 'Cancel creation' && TINY_MCE_API_KEY !== '') ? (
                    <div className='flex flex-col w-full p-4 rounded-b-lg bg-blue-50'>
                        <div className='w-full'>
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
                ) : null
            }
        </div>
    )
}