import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative inset-x-0 bottom-0 rounded-lg bg-white">
      <hr />
      <div className="mx-auto w-full max-w-screen-xl px-4 py-2 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/mentore.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWVudG9yZS5qcGciLCJpYXQiOjE3MzAxODUwOTQsImV4cCI6MTg4Nzg2NTA5NH0.kJcsFJEOAC4hrV88B9d0FnDp1wgpntRboWfe0RIJAOo&t=2024-10-29T06%3A58%3A14.455Z"
              className="h-8"
              alt="Mentore"
            />
          </Link>
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-2 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 rtl:space-x-reverse">
            <li>
              <Link
                to="/results"
                className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
              >
                Find mentor
              </Link>
            </li>
            <li>
              <Link
                to="/live-webinars"
                className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
              >
                Live Webinars
              </Link>
            </li>
            <li>
              <Link
                to="/insights"
                className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
              >
                Insights
              </Link>
            </li>
            <li>
              <Link
                to="/qna"
                className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700"
              >
                QnA
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-4 dark:border-gray-700" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <Link to="/" className="hover:underline">
            Mentore™
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
