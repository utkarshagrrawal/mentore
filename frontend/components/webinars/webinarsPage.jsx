import React, { useEffect, useState, useRef } from "react";
import Header from "../global/header";
import { ErrorNotify } from "../global/toast";
import WebinarsDisplay from "./webinarsDisplay";
import EmptyWebinarsPage from "./emptyWebinarsPage";

export function WebinarsPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true)


    const [searchTitle, setSearchTitle] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const user = useRef({});
    // const allWebinars = useRef([])
    // const filteredWebinars = useRef([]);

    const [allWebinars, setAllWebinars] = useState([]);
    const [filteredWebinars, setFilteredWebinars] = useState([]);

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
                localStorage.removeItem('token');
                setLoggedIn(false);
            } else {
                user.current = result.result;
                setLoggedIn(true);
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        const webinars = async () => {
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                },
            };
            let webinars = await fetch("https://mentore-ten.vercel.app/webinar/all", options);
            const result = await webinars.json();
            if (result.error) {
                ErrorNotify("Some error occurred while fetching webinars")
            } else {
                setAllWebinars(result.success);
                // filteredWebinars.current = result.success;
                setFilteredWebinars(result.success);
                setLoading(false);
            }
        }
        if (loading) {
            webinars();
        }
    }, [loading])

    useEffect(() => {
        console.log(allWebinars);
        console.log(filteredWebinars);
    }, [allWebinars, filteredWebinars])


    const handleFilter = () => {
        const filteredWebinars1 = allWebinars.filter(webinar => {
            const webinarTitle = webinar.title.toLowerCase();
            const authorName = webinar.mentor_name.toLowerCase();
            const webinarStartDate = new Date(webinar.start_time).toDateString(); // Convert to date string for comparison
            const filterStartDate = new Date(startDate).toDateString();

            return webinarTitle.includes(searchTitle.toLowerCase()) &&
                authorName.includes(searchAuthor.toLowerCase()) &&
                (!startDate || webinarStartDate === filterStartDate);

        })

        setFilteredWebinars(filteredWebinars1);
    }

    return (
        <div className='min-h-screen items-center flex flex-col w-full '>
            <Header loggedIn={loggedIn} />
            <div className="flex flex-row">
                <div className="flex flex-col w-1/4 pt-16 items-center">
                    <input className="m-2 w-3/4 border border-black p-1" type="text" placeholder="webinar title" value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
                    <input className="m-2 w-3/4 border border-black p-1" type="text" placeholder="Author name" value={searchAuthor} onChange={(e) => setSearchAuthor(e.target.value)} />
                    <input className="m-2 w-3/4 border border-black p-1" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <button className="bg-blue-500 text-white w-3/4 m-2 p-1" onClick={handleFilter}>Filter</button>
                </div>
                <div className="w-3/4">
                    {filteredWebinars?.length > 0 ? <WebinarsDisplay allWebinars={filteredWebinars} loading={loading} setLoading={setLoading} user={user} /> : <EmptyWebinarsPage />}
                </div>
            </div>

        </div>
    )
}
