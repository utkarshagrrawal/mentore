import React, { useState, useEffect, useRef } from "react";
import { ErrorNotify } from "../global/toast";

export default function Content({ blogId }) {
  const blog = useRef({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlog = async () => {
      let users = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/blog/${blogId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await users.json();
      if (result.error) {
        ErrorNotify("Some error occured. Please try again");
      } else {
        blog.current = result.result;
      }
      setLoading(false);
    };
    getBlog();
  }, []);

  return (
    !loading && (
      <div className="w-full">
        <div className="mb-10 sm:mx-16 mx-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4 mt-10">
            {blog.current.title}
          </h1>
          <h2 className="text-lg font-semibold text-center text-gray-700 mb-8">
            By {blog.current.name}
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div dangerouslySetInnerHTML={{ __html: blog.current.content }} />
          </div>
        </div>
      </div>
    )
  );
}
