import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { questions } from "../../src/assets/question_ans";
import parse from "html-react-parser";

import LandingHeader from "../global/landingHeader";
import Search from "./search";
import Testimonials from "./testimonials";
import Benefits from "./benefits";

export function Home() {
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const handleQuestionClick = (id) => {
        setSelectedQuestion(id === selectedQuestion ? null : id);
    };

    return (
        <>

            <LandingHeader />

            <Search />

            <Testimonials />

            <Benefits />

            <div className="mx-auto my-10 flex flex-col items-center justify-center gap-4">
                <p className="text-2xl font-bold md:text-6xl">Frequently Asked</p>
                <p className="text-2xl font-bold md:text-6xl">Questions</p>
            </div>

            <div className="mx-auto mb-20 flex w-3/4 flex-col">
                {questions.map(({ id, question, answer }) => (
                    <div key={id} className="mb-4 w-full">
                        <button
                            type="button"
                            className="flex w-full items-center justify-between gap-3 rounded-t-xl border border-b-0 border-gray-200 p-5 font-medium  text-black hover:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
                            onClick={() => handleQuestionClick(id)}
                        >
                            <span>{question.split(": ")[1]}</span>
                            <svg
                                className={`h-3 w-3 shrink-0 ${selectedQuestion != id ? "rotate-180 transform transition duration-500" : "transition duration-500"}`}
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5 5 1 1 5"
                                />
                            </svg>
                        </button>
                        {selectedQuestion === id && (
                            <div className="dark:border-gray-150 border border-b-0 border-gray-200 p-5 dark:bg-gray-100">
                                {parse(answer)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <footer className="relative inset-x-0 bottom-0 rounded-lg bg-white">
                <hr />
                <div className="mx-auto w-full max-w-screen-xl px-4 py-2 md:py-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <Link
                            to="/"
                            className="flex items-center space-x-3 rtl:space-x-reverse"
                        >
                            <img src="../static/logo.png" className="h-8" alt="Mentore" />
                        </Link>
                        <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-2 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse">
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
                        </ul>
                    </div>
                    <hr className="my-6 border-gray-200 sm:mx-auto lg:my-4 dark:border-gray-700" />
                    <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
                        © 2024{" "}
                        <Link to="/" className="hover:underline">
                            Mentore™
                        </Link>
                        . All Rights Reserved.
                    </span>
                </div>
            </footer>
        </>
    );
}