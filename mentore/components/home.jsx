import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { data } from "../src/assets/stories";
import { questions } from "../src/assets/question_ans";
import parse from "html-react-parser";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
                },
            };
            let users = await fetch("http://localhost:3000/getcurrentuser", options);
            const result = await users.json();
            if (result.error) {
                setLoggedIn(false);
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

    const handleQuestionClick = (id) => {
        setSelectedQuestion(id === selectedQuestion ? null : id);
    };

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true
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

            <div className="mx-4 lg:mx-20 my-10 p-4 flex h-[42rem] flex-col items-center justify-center rounded-lg bg-gradient-to-r from-blue-300 via-gray-300 to-yellow-300">
                <div className="flex flex-col items-center">
                    <h1 className="mb-4 font-sans text-4xl font-semibold">
                        1:1 Long Term Mentorship for
                    </h1>
                    <h1
                        className="font-sans text-3xl font-semibold"
                        id="welcomeText"
                    >
                        {welcomeMessages[index % welcomeMessages.length]}
                    </h1>
                </div>
                <form class="m-10 flex items-center justify-center" onSubmit={handleSearch}>
                    <div class="relative">
                        <input type="search" id="default-search" class="w-64 md:w-80 lg:w-96 lg:focus:w-[36rem] h-12 px-4 py-2 text-sm text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300" placeholder="Search domains, mentors..." required />
                        <button type="submit" class="absolute inset-y-0 right-0 px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 rounded-r-md duration-300">
                            Search
                        </button>
                    </div>
                </form>
            </div>

            <div className="my-10 flex flex-col items-center justify-center">
                <p className="mb-10 text-2xl font-bold md:text-6xl">Our Testimonials</p>
                <div className="container">
                    <Slider {...settings}>
                        {data.map((data) => (
                            <div key={data.id} className="mx-8 max-w-sm min-h-[42rem] shadow-lg hover:shadow-2xl duration-200 rounded-xl overflow-hidden border-2 border-solid">
                                <div className="aspect-[3/4]">
                                    <img src={data.img} className="object-cover w-full h-full" alt="author photo" />
                                </div>
                                <div className="p-4">
                                    <p className="text-xl font-semibold text-gray-900 mb-2">{data.name}</p>
                                    <hr className="my-2 border-t border-gray-300" />
                                    <p className="text-sm text-gray-700">{data.review}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div >

            <div className="mx-auto my-10 flex flex-col items-center justify-center gap-4">
                <p className="text-2xl font-bold md:text-6xl">No need to struggle</p>
                <p className="text-2xl font-bold md:text-6xl">alone anymore</p>
            </div>

            <div className="mx-auto grid w-3/4 grid-cols-1 md:gap-2 lg:grid-cols-2">
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
