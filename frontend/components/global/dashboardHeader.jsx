import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiLockPasswordLine, RiLogoutCircleRLine } from "react-icons/ri";
import { ErrorNotify } from "./toast";

export default function DashboardHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    let logoutReq = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/user/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    let response = await logoutReq.json();
    if (response.success) {
      navigate("/user/login");
    } else {
      ErrorNotify(response.error || "Error logging out");
    }
  };

  return (
    <header className="w-full">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:gap-0 gap-4 min-[500px]:justify-between py-4">
        <Link to="/" className="flex items-center justify-center gap-2">
          <img
            src="https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/mentore.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWVudG9yZS5qcGciLCJpYXQiOjE3MzAxODUwOTQsImV4cCI6MTg4Nzg2NTA5NH0.kJcsFJEOAC4hrV88B9d0FnDp1wgpntRboWfe0RIJAOo&t=2024-10-29T06%3A58%3A14.455Z"
            className="h-8 mix-blend-multiply"
            alt="Mentore"
          />
          <span className="text-2xl font-semibold text-blue-700">Mentore</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/user/change-password"
            type="button"
            className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm text-blue-700 hover:text-white bg-blue-100 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none duration-200"
          >
            <RiLockPasswordLine />
            Change Password
          </Link>
          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-sm text-red-700 hover:text-white bg-red-100 hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:outline-none duration-200"
          >
            <RiLogoutCircleRLine />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
