import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiLockPasswordLine, RiLogoutCircleRLine } from "react-icons/ri";

export default function DashboardHeader() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/user/login");
  };

  return (
    <header className="w-full">
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:gap-0 gap-4 min-[500px]:justify-between mx-10 sm:mx-14 my-3">
        <Link to="/" className="flex items-center justify-center gap-2">
          <img
            src="https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nby5wbmciLCJpYXQiOjE3MTIzNDQ0ODEsImV4cCI6MTc0Mzg4MDQ4MX0.R_a_H8TO26tJm794AbsCJzLN4tdFGyF2dIPrnYfWzzg&t=2024-04-05T19%3A14%3A41.780Z"
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
      <hr className="w-full"></hr>
    </header>
  );
}
