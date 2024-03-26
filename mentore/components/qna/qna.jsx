import React, { useEffect, useState } from "react";
import Header from "../global/header";
import AskQuestion from "./askQuestion";
import { QuestionCard } from "./questionsCard";
import { ErrorNotify } from "../global/toast";


export function Qna() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                },
            };

            const response = await fetch("https://mentore-ten.vercel.app/user/details", options);
            const result = await response.json();

            if (result.error) {
                localStorage.removeItem('token');
                setLoggedIn(false);
            } else {
                setLoggedIn(true);
            }
        }

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                },
            };

            const response = await fetch("https://mentore-ten.vercel.app/question/all", options);
            const result = await response.json();

            if (result.error) {
                ErrorNotify("Error fetching questions")
            } else {
                setQuestions(result.result);
            }
            setLoading(false);
        }

        if (loading) {
            fetchQuestions();
        }
    }, [loading])

    return (
        <div className="min-h-screen w-full mb-10">
            <Header loggedIn={loggedIn} />

            <AskQuestion setLoading={setLoading} />

            {
                questions.length > 0 && questions.map((question, index) => {
                    return (
                        <QuestionCard key={index} {...question} />
                    )
                })
            }
        </div>
    )

}