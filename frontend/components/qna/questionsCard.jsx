import React from "react";
import { useNavigate } from "react-router-dom";

export function QuestionCard(props) {
  const dateFormatter = Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const navigate = useNavigate();

  const handleView = () => {
    navigate("/question/" + props?.id);
  };

  return (
    <div
      className="border border-gray-300 mx-16 mt-8 rounded-lg shadow-lg p-6 hover:shadow-2xl duration-200 hover:cursor-pointer"
      onClick={handleView}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h1 className="text-gray-700 font-semibold">
            Asked by: {props?.asked_by_name}
          </h1>
        </div>
        <div className="flex items-center">
          <span className="text-blue-600 font-semibold">
            {props?.answered_by}
          </span>
          <p className="text-gray-500 ml-2">Answers</p>
          <p className="text-gray-500 ml-4">
            Posted on: {dateFormatter.format(new Date(props?.created_at))}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Question:</h2>
        <p className="text-lg text-gray-700">{props?.question}</p>
      </div>
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-gray-900 mr-2">Tags:</h2>
        <div className="flex flex-wrap">
          {props?.tags?.length > 0 &&
            props.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-500 text-white rounded-md mr-2 mb-2 hover:bg-blue-700"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}
