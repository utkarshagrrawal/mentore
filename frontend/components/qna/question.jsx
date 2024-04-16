import React, { useEffect, useState } from "react";
import Header from "../global/header";
import { ErrorNotify, SuccessNotify } from "../global/toast";
import { useParams } from "react-router-dom";
import Answers, { createNestedAnswers } from "./answer";

export function Question() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [question, setQuestion] = useState([]);
    const [answer, setAnswer] = useState("");
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answering, setAnswering] = useState(false);
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

            const response = await fetch("https://mentore-backend.vercel.app/user/details", options);
            const result = await response.json();

            if (result.error) {
                setLoggedIn(false);
            } else {
                setLoggedIn(true);
                setUser(result.result);
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

            const response = await fetch(`https://mentore-backend.vercel.app/question/${id}/answer/all`, options);
            const result = await response.json();

            if (result.error) {
                ErrorNotify("Some error occured. Please try again")
            } else {
                const nestedAnswers = createNestedAnswers(result.result);
                setAnswers(nestedAnswers);
            }
            setLoading(false);
        }

        if (loading) {
            fetchAnswers();
        }
    }, [loading])

    useEffect(() => {
        const fetchQuestion = async () => {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                }
            }

            const response = await fetch(`https://mentore-backend.vercel.app/question/${id}`, options);
            const result = await response.json();

            if (result.error) {
                ErrorNotify("Some error occured. Please try again")
            } else {
                setQuestion(result.result);
            }
        }

        fetchQuestion();
    }, [])

    const handleChange = (e) => {
        setAnswer(e.target.value);
    }

    const handleAnswer = async (e) => {
        e.preventDefault();

        if (answer.trim() === "") {
            ErrorNotify("Answer cannot be empty");
            return;
        }
        if (answer.length < 30) {
            ErrorNotify("Answer should be at least 30 characters long");
            return;
        }

        setAnswering(true);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            },
            body: JSON.stringify({ answer: answer })
        }

        const response = await fetch(`https://mentore-backend.vercel.app/question/${id}/answer`, options);
        const result = await response.json();

        if (result.error) {
            ErrorNotify("Some error occured. Please try again")
        } else {
            SuccessNotify("Answer posted successfully")
            setAnswer("");
        }

        setAnswering(false);
        setLoading(true);
    }

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

            <div className={`mx-16 mt-10 p-6 border rounded-lg shadow-md ${user.type === 'mentor' || "hidden"}`}>
                <form onSubmit={handleAnswer}>
                    <textarea
                        className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500"
                        rows="4"
                        placeholder="Type your answer here..."
                        value={answer}
                        onChange={handleChange}
                        required
                    ></textarea>
                    <button
                        type="submit"
                        disabled={answering}
                        className="mt-4 w-full bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 flex justify-center"
                    >
                        {
                            answering ? (
                                <div className="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-blue-600" />
                            ) : (
                                "Answer"
                            )
                        }
                    </button>
                </form>
            </div>

            <Answers answers={answers} questionId={id} user={user} setLoading={setLoading} />
        </>
    )
}