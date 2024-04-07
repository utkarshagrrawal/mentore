import React, { useEffect, useState } from "react";
import Header from "../global/header";
import AskQuestion from "./askQuestion";
import { QuestionCard } from "./questionsCard";
import { DismissToast, ErrorNotify, Loading } from "../global/toast";
import Select from "react-select"


export function Qna() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

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

    useEffect(() => {
        const fetchTags = async () => {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                },
            };

            const response = await fetch("https://mentore-ten.vercel.app/mentor/skill-options", options);
            const result = await response.json();

            if (result.error) {
                ErrorNotify("Error fetching skills")
            } else {
                setTags(result.result);
            }
        }

        fetchTags();
    }, [])

    const handleFilter = async () => {
        const filterQuestions = async () => {
            const toastId = Loading("Filtering questions")

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token"),
                },
                body: JSON.stringify({ tags: selectedTags })
            }

            const response = await fetch("https://mentore-ten.vercel.app/question/filter", options);
            const result = await response.json();

            DismissToast(toastId);

            if (result.error) {
                ErrorNotify("Error fetching questions")
            } else {
                setQuestions(result.result);
            }
        }

        filterQuestions();
    }

    const handleChange = (selectedOptions) => {
        setSelectedTags(selectedOptions.map(option => option.value));
    }

    return (
        <div className="min-h-screen w-full mb-10">
            <Header loggedIn={loggedIn} />

            <AskQuestion setLoading={setLoading} tags={tags} />

            <div className="mx-16 mt-10">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Filter questions</h2>
                <div className="flex w-full">
                    <Select isDisabled={tags.length === 0} className="w-full" isMulti placeholder="Select tags" onChange={handleChange} options={tags.map(tag => { return { value: tag.name, label: tag.name } })} />
                    <button className="bg-blue-500 text-white px-4 py-1 rounded-lg ml-2" onClick={handleFilter}>Filter</button>
                </div>
            </div>

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