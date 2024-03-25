import React, { useEffect, useState } from "react";
import Header from "../global/header";
import { ErrorNotify } from "../global/toast";
import { useParams } from "react-router-dom";

export function Question() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [question, setQuestion] = useState([]);
    const [answers, setAnswers] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                }
            }

            const response = await fetch("https://mentore-ten.vercel.app/user/details", options);
            const result = await response.json();

            if (result.error) {
                setLoggedIn(false);
            } else {
                setLoggedIn(true);
            }
        }

        fetchUser();
    }, [])

    useEffect(() => {
        const fetchAnswers = async () => {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                }
            }

            const response = await fetch(`https://mentore-ten.vercel.app/question/${id}/answer/all`, options);
            const result = await response.json();

            if (result.error) {
                ErrorNotify(result.error)
            } else {
                setAnswers(result.result);
            }
        }

        fetchAnswers();
    }, [])

    useEffect(() => {
        const fetchQuestion = async () => {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                }
            }

            const response = await fetch(`https://mentore-ten.vercel.app/question/${id}`, options);
            const result = await response.json();

            if (result.error) {
                ErrorNotify(result.error)
            } else {
                setQuestion(result.result);
            }
        }

        fetchQuestion();
    }, [])

    return (
        <>
            <Header loggedIn={loggedIn} />

            <div className="border border-gray-300 mx-16 mt-8 rounded-lg shadow-lg p-6">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Question:</h2>
                    <p className="text-lg text-gray-700">{question[0]?.question}</p>
                </div>
                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-900">Tags:</h2>
                    <div className="flex flex-wrap mt-2">
                        {question.length > 0 && question[0].tags?.length > 0 && question[0].tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-500 text-white rounded-lg mr-2 mb-2 hover:bg-blue-700">{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}