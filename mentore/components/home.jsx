import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { data } from "../src/assets/stories";
import { questions } from "../src/assets/question_ans";
import parse from "html-react-parser";

export function Home() {
    const [visible, setVisible] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const welcomeMessages = [
        "Cracking your dream job",
        "Staying consistent and motivated",
        "Cracking On Campus Placements",
        "Growing in your current role",
        "Switching to a new Domain",
    ];
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    const handleChange = () => {
        setVisible(!visible);
        if (visible) {
            document.getElementById("navbar-default").classList.add("hidden");
        } else {
            document.getElementById("navbar-default").classList.remove("hidden");
        }
    };

    useEffect(() => {
        const getUser = async () => {
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            };
            let users = await fetch("http://localhost:3000/getcurrentuser", options);
            const result = await users.json();
            if (result.error) {
                setLoggedIn(false);
                localStorage.removeItem("token");
                localStorage.removeItem("name");
                localStorage.removeItem("email");
            } else {
                setLoggedIn(true);
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((index) => index + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex + 3 >= data.length ? 0 : prevIndex + 3,
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleQuestionClick = (id) => {
        setSelectedQuestion(id === selectedQuestion ? null : id);
    };

    return (
        <>
            <nav className="border-gray-200 bg-white">
                <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 rtl:space-x-reverse"
                    >
                        <img src="../static/logo.png" className="h-8" alt="Mentore" />
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
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse">
                            <li>
                                <Link
                                    to="/find-mentor"
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
                                        to="/login"
                                        className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
                                    >
                                        Login
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <Link
                                        to="/profile"
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

            <div className="mx-4 my-10 flex h-96 flex-col items-center justify-center rounded-lg bg-gradient-to-r from-blue-300 via-gray-300 to-yellow-300 p-4 lg:mx-20">
                <div className="flex flex-col items-center">
                    <h1 className="mb-4 font-sans text-4xl font-semibold">
                        1:1 Long Term Mentorship for
                    </h1>
                    <h1
                        className="font-sans text-3xl font-semibold transition-opacity duration-500 hover:opacity-50"
                        id="welcomeText"
                    >
                        {welcomeMessages[index % welcomeMessages.length]}
                    </h1>
                </div>
                <form className="m-10" onSubmit={handleSearch}>
                    <label
                        htmlFor="default-search"
                        className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                            <svg
                                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-64 rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:w-80 lg:w-96"
                            placeholder="Search domains, mentors..."
                            required
                        />
                        <button
                            type="submit"
                            className="absolute bottom-2.5 end-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center">
                <p className="mb-12 text-2xl font-bold md:text-6xl">Our Testimonials</p>
                <div className="duration-5000 flex w-full flex-wrap justify-center transition-all">
                    {data.slice(currentIndex, currentIndex + 3).map((data) => (
                        <div
                            key={data.id}
                            className="card border-dark-500 h-608px mx-8 mb-8 flex w-96 flex-col justify-center rounded-lg border-2 border-solid p-5 pt-9 shadow-2xl"
                        >
                            <img
                                src={data.img}
                                className="mb-7 flex h-80 w-72 self-center rounded-lg object-contain"
                                alt="author photo"
                            />
                            <p className="mb-5 flex self-center text-xl font-medium">
                                {data.name}
                            </p>
                            <hr />
                            <p className="flex self-center text-lg font-normal">
                                {data.review}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto mt-12 mb-10 flex flex-col items-center justify-center gap-4">
                <p className="text-2xl font-bold md:text-6xl">No need to struggle</p>
                <p className="text-2xl font-bold md:text-6xl">alone anymore</p>
            </div>

            <div className="mx-auto mb-20 grid w-3/4 grid-cols-1 md:gap-2 lg:grid-cols-2">
                <div className="border-dark-500 flex flex-col items-center justify-center rounded-lg border-2 border-solid p-10 md:flex-row">
                    <div className="flex w-64 flex-col p-1 ">
                        <p className="mb-8 text-sm">1:1 SESSION</p>
                        <div>
                            <p className="mb-3 text-2xl font-medium">
                                Never question your progress with frequent 1:1 sessions
                            </p>
                            <p className="text-sm">
                                Mentor will use this 1 hour sessions to solve problems, learn
                                concepts, do projects, strategies & everything needed to achieve
                                your goals.{" "}
                            </p>
                        </div>
                    </div>
                    <div className="flex w-1/2 items-center justify-center">
                        <img
                            src="../static/grid_2.jpg"
                            className="rounded-lg"
                            alt="grid image"
                        />
                    </div>
                </div>

                <div className="border-dark-500 flex flex-col items-center justify-center rounded-lg border-2 border-solid p-10 md:flex-row ">
                    <div className="flex w-64 flex-col p-1">
                        <p className="mb-8 text-sm ">UNLIMITED CHAT</p>
                        <div>
                            <p className="mb-3 text-2xl font-medium">
                                Doubts? Get the right advice from your mentor via Chat
                            </p>
                            <p className="text-sm">
                                Mentor will be just one ping away to solve all your queries
                                whenever required.
                            </p>
                        </div>
                    </div>
                    <div className="flex w-1/2 items-center justify-center">
                        <img
                            src="../static/grid-4.jpg"
                            className="rounded-lg"
                            alt="grid image"
                        />
                    </div>
                </div>

                <div className="border-dark-500 flex flex-col items-center justify-center rounded-lg border-2 border-solid p-10 md:flex-row">
                    <div className="flex w-64 flex-col p-1">
                        <p className="mb-8 text-sm">REGULAR FOLLOWUPS</p>
                        <div>
                            <p className="mb-3 text-2xl font-medium">
                                Stay motivated and consistent with regular follow-ups
                            </p>
                            <p className="text-sm">
                                Mentor will keep a check on you, motivate and unblock you
                                regularly.
                            </p>
                        </div>
                    </div>
                    <div className="flex w-1/2 items-center justify-center">
                        <img
                            src="../static/grid-3.webp"
                            className="rounded-lg"
                            alt="grid image"
                        />
                    </div>
                </div>

                <div className="border-dark-500 flex flex-col items-center justify-center rounded-lg border-2 border-solid p-10 md:flex-row">
                    <div className="flex w-64 flex-col p-1">
                        <p className="mb-8 text-sm">TASKS & RESOURCES</p>
                        <div>
                            <p className="mb-3 text-2xl font-medium">
                                Avoid wasting time on irrelevant tasks and resources
                            </p>
                            <p className="text-sm">
                                Mentor will give you clearly defined take home tasks,
                                assignments and associated resources to study, personalised to
                                your goals.
                            </p>
                        </div>
                    </div>
                    <div className="flex w-1/2 items-center justify-center">
                        <img
                            src="../static/grid_1.webp"
                            className="rounded-lg"
                            alt="grid image"
                        />
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-12 mb-10 flex flex-col items-center justify-center gap-4">
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
                                    to="/find-mentor"
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
