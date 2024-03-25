import React, { useEffect, useState } from "react";
import { ErrorNotify, SuccessNotify } from "../global/toast";
import Select from "react-select";


export default function AskQuestion() {
    const [tags, setTags] = useState([]);
    const [question, setQuestion] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [asking, setAsking] = useState(false);

    useEffect(() => {
        const fetchSkills = async () => {
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
                ErrorNotify(result.error)
            } else {
                setTags(result.result);
            }
        }
        fetchSkills();
    }, [])

    const handleSelectChange = selectedOptions => {
        setSelectedTags(selectedOptions.map(option => option.value))
    }

    const handleChange = (e) => {
        setQuestion(e.target.value);
    }

    const handleAsk = async () => {
        if (question === "") {
            ErrorNotify("Question cannot be empty");
            return;
        }

        setAsking(true);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token"),
            },
            body: JSON.stringify({ question: question, tags: selectedTags })
        }

        const response = await fetch("https://mentore-ten.vercel.app/question/ask", options);
        const result = await response.json();

        if (result.error) {
            ErrorNotify(result.error)
        } else {
            SuccessNotify("Question posted successfully");
        }

        setSelectedTags([]);
        setQuestion("");
        setAsking(false);
    }

    return (
        <div className="mx-16">
            <div className="mt-10 bg-white border rounded-lg">
                <div className="px-6 pb-2 pt-4">
                    <label htmlFor="question" className="block text-gray-700 text-lg font-bold mb-2">What's your question?</label>
                    <textarea id="question" name="question" value={question} onChange={handleChange} className="w-full h-40 px-4 py-2 text-gray-700 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none" placeholder="Type your question here..." />
                </div>
                <div className="px-6 py-2">
                    <label htmlFor="tags" className="block text-gray-700 text-lg font-bold mb-2">Select Tags</label>
                    <Select isMulti className="basic-multi-select w-full"
                        isDisabled={tags?.length === 0}
                        classNamePrefix="select"
                        onChange={handleSelectChange}
                        options=
                        {
                            tags?.length > 0 && tags.map((tag) => {
                                return { value: tag.name, label: tag.name }
                            })
                        }
                    />
                </div>
                <div className="px-6 pt-2 pb-4 flex justify-end">
                    <button onClick={handleAsk} disabled={asking} className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline">
                        {asking ? (
                            <div className="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-blue-600" />
                        ) : (
                            "Ask"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}