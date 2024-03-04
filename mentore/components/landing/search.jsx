import React, { useEffect, useState } from "react";


export default function Search() {
    const messages = [
        "Cracking your dream job",
        "Staying consistent and motivated",
        "Cracking On Campus Placements",
        "Growing in your current role",
        "Switching to a new Domain",
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((index) => index + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
    }

    return (
        <div className="mx-4 lg:mx-20 my-10 p-4 flex h-[42rem] flex-col items-center justify-center rounded-lg bg-gradient-to-r from-blue-300 via-gray-300 to-yellow-300">
            <div className="flex flex-col items-center">
                <h1 className="mb-4 font-sans text-4xl font-semibold">
                    1:1 Long Term Mentorship for
                </h1>
                <h1
                    className="font-sans text-3xl font-semibold"
                    id="welcomeText"
                >
                    {messages[index % messages.length]}
                </h1>
            </div>
            <form className="m-10 flex items-center justify-center" onSubmit={handleSearch}>
                <div className="relative">
                    <input type="search" id="default-search" className="w-64 md:w-80 lg:w-96 lg:focus:w-[36rem] h-12 px-4 py-2 text-sm text-gray-700 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300" placeholder="Search domains, mentors..." required />
                    <button type="submit" className="absolute inset-y-0 right-0 px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 rounded-r-md duration-300">
                        Search
                    </button>
                </div>
            </form>
        </div>
    )
}