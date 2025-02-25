import React, { useEffect, useState } from "react";
import Header from "../global/header";
import AskQuestion from "./askQuestion";
import { QuestionCard } from "./questionsCard";
import { DismissToast, ErrorNotify, Loading } from "../global/toast";
import Select from "react-select";

const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export function Qna() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/user/details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response.json();

      if (result.error) {
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/question/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response.json();

      if (result.error) {
        ErrorNotify("Error fetching questions");
      } else {
        setQuestions(result.result);
      }
      setLoading(false);
    };

    if (loading) {
      fetchQuestions();
    }
  }, [loading]);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/mentor/skill-options",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response.json();

      if (result.error) {
        ErrorNotify("Error fetching skills");
      } else {
        setTags(result.result);
      }
    };

    fetchTags();
  }, []);

  const handleFilter = async () => {
    const filterQuestions = async () => {
      const toastId = Loading("Filtering questions");

      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/question/filter?page=" + page,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ tags: selectedTags }),
        }
      );
      const result = await response.json();

      DismissToast(toastId);

      if (result.error) {
        ErrorNotify("Error fetching questions");
      } else {
        setQuestions(result.result);
      }
    };

    filterQuestions();
  };

  const handleChange = (selectedOptions) => {
    setSelectedTags(selectedOptions.map((option) => option.value));
  };

  return (
    <div className="min-h-screen w-full mb-10">
      <Header loggedIn={loggedIn} />

      <AskQuestion setLoading={setLoading} tags={tags} loggedIn={loggedIn} />

      <div className="mx-16 mt-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Filter questions
        </h2>
        <div className="flex w-full">
          <Select
            isDisabled={tags.length === 0}
            className="w-full"
            isMulti
            placeholder="Select tags"
            onChange={handleChange}
            options={tags.map((tag) => {
              return { value: tag.name, label: tag.name };
            })}
          />
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded-lg ml-2"
            onClick={handleFilter}
          >
            Filter
          </button>
        </div>
      </div>

      {questions.length > 0 &&
        questions.map((question, index) => {
          return <QuestionCard key={index} {...question} />;
        })}
    </div>
  );
}
