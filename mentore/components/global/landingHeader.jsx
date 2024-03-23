import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function LandingHeader() {
    const [visible, setVisible] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                },
            };
            let users = await fetch("https://mentore-ten.vercel.app/user/details", options);
            const result = await users.json();
            if (result.error) {
                setLoggedIn(false);
            } else {
                setLoggedIn(true);
            }
        };
        getUser();
    }, []);

    const handleChange = () => {
        setVisible(!visible);
    };

    return (
        <>
            <nav className="border-gray-200 bg-white">
                <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 rtl:space-x-reverse"
                    >
                        <img src="https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nby5wbmciLCJpYXQiOjE3MTExODg4NzQsImV4cCI6MTc0MjcyNDg3NH0.KFDnSmauZ-GWjuA9Si0SajJG2a0iizGTKlpVZVjZYQg&t=2024-03-23T10%3A14%3A34.573Z" className="h-8" alt="Mentore" />
                    </Link>
                    <button
                        data-collapse-toggle="navbar-default"
                        type="button"
                        aria-controls="navbar-default"
                        onClick={handleChange}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
                        aria-expanded={visible ? "true" : "false"}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="h-5 w-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                    <div className={`${visible && 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
                        <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse">
                            <li>
                                <Link
                                    to="/results"
                                    className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
                                >
                                    Find mentor
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/live-webinars"
                                    className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
                                >
                                    Live Webinars
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/insights"
                                    className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
                                >
                                    Insights
                                </Link>
                            </li>
                            {!loggedIn ? (
                                <li>
                                    <Link
                                        to="/user/login"
                                        className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
                                    >
                                        Login
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <Link
                                        to="/user/dashboard"
                                        className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
            <hr />
        </>
    )
}