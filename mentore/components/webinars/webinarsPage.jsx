import React, { useEffect, useState, useRef } from "react";
import Header from "../global/header";
import { ErrorNotify } from "../global/toast";
import WebinarCard from "./webinarCard";

export function WebinarsPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true)
    const allWebinars = useRef([])

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
        const webinars = async () => {
            setLoading(true)
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            let webinars = await fetch("http://localhost:3000/allwebinars", options);
            const result = await webinars.json();
            if (result.error) {
                ErrorNotify("Some error occurred while fetching webinars")
            } else {
                allWebinars.current = result.success;
                setLoading(false)
            }
        }
        webinars();
    }, [])

    return (
        <div className='min-h-screen items-center flex flex-col w-full'>
            <Header loggedIn={loggedIn} />

            <div className="w-full">
                <div className="flex flex-wrap justify-center items-center mx-16 mt-3 mb-14">
                    <h1 className="text-4xl font-bold mr-16 text-center">Live webinars</h1>
                </div>
                <div className="flex w-full flex-wrap justify-center items-center my-3">
                    <div className="w-full mx-16 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                        {!loading && allWebinars.current.map((webinar, index) => {
                            if (new Date().toISOString() < new Date(webinar.end_time).toISOString()) {
                                return <WebinarCard webinar={webinar} key={index} />
                            }
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
