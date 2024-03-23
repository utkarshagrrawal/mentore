import React, { useEffect, useState, useRef } from "react";
import Header from "../global/header";
import { ErrorNotify } from "../global/toast";
import WebinarsDisplay from "./webinarsDisplay";
import EmptyWebinarsPage from "./emptyWebinarsPage";

export function WebinarsPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true)
    const user = useRef({});
    const allWebinars = useRef([])

    useEffect(() => {
        const getUser = async () => {
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            let users = await fetch("https://mentore-ten.vercel.app/user/details", options);
            const result = await users.json();
            if (result.error) {
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
                },
            };
            let webinars = await fetch("https://mentore-ten.vercel.app/webinar/all", options);
            const result = await webinars.json();
            if (result.error) {
                ErrorNotify("Some error occurred while fetching webinars")
            } else {
                allWebinars.current = result.success;
                setLoading(false)
            }
        }
        if (loading) {
            webinars();
        }
    }, [loading])

    return (
        <div className='min-h-screen items-center flex flex-col w-full mb-10'>
            <Header loggedIn={loggedIn} />
            {allWebinars.current?.length > 0 ? <WebinarsDisplay allWebinars={allWebinars} loading={loading} setLoading={setLoading} user={user} /> : <EmptyWebinarsPage />}
        </div>
    )
}
