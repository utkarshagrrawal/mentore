import React, { useState } from "react";
import { questions } from "../../src/assets/question_ans";

export default function Faq() {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleQuestionClick = (id) => {
    setSelectedQuestion(id === selectedQuestion ? null : id);
  };

  return (
    <div className="container mx-auto my-10">
      <p className="text-2xl text-center font-bold md:text-6xl">
        Frequently Asked
      </p>
      <p className="text-2xl text-center font-bold md:text-6xl">Questions</p>
      <div className="mx-auto mt-10">
        {questions.map(({ id, question, answer }) => (
          <div key={id} className="mb-4 w-full">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 rounded-t-xl border border-b-0 border-gray-200 p-5 font-medium  text-black hover:bg-gray-100 dark:text-black dark:hover:bg-gray-200"
              onClick={() => handleQuestionClick(id)}
            >
              <span>{question.split(": ")[1]}</span>
              <svg
                className={`h-3 w-3 shrink-0 ${
                  selectedQuestion != id
                    ? "rotate-180 transform transition duration-500"
                    : "transition duration-500"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
            {selectedQuestion === id && (
              <div className="dark:border-gray-150 border border-b-0 border-gray-200 p-5 dark:bg-gray-100">
                <div
                  dangerouslySetInnerHTML={{
                    __html: answer,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
