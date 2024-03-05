import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";


import Header from "../global/header";
import Content from "./content";
import Comments from "./comments";

export function Blog() {
    const user = useRef([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    // checks if the user is logged in
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
                navigate('/login');
                setLoggedIn(false);
            } else {
                user.current = result.result;
                setLoggedIn(true);
            }
        };
        getUser();
    }, []);


    return (
        <>
            <Header loggedIn={loggedIn} />

            <Content blogId={id} />

            <Comments blogId={id} user={user} />
        </>
    )
}