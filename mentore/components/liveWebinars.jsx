import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function LiveWebinars() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      };
      let users = await fetch("http://localhost:3000/getcurrentuser", options);
      const result = await users.json();
      if (result.error) {
        setLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
      } else {
        setLoggedIn(true);
      }
    };
    getUser();
  }, []);

  const handleLogButton = () => {
    if (loggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }

  return (
    <div className='min-h-screen items-center flex flex-col w-full'>
      <div className='w-full bg-[#d2d2d217]'>
        <div className='flex flex-wrap justify-center items-center md:justify-between lg:justify-between mx-16 my-3'>
          <Link to='/'><img src="../static/logo.png" className="h-8 mix-blend-multiply" alt="Mentore" /></Link>
          <input type='search' placeholder='Search for mentors' className='lg:w-[40rem] md:w-[26rem] w-[16rem] border-2 border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300' />
          <button onClick={handleLogButton} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3'>{loggedIn ? 'Dashboard' : 'Login'}</button>
        </div>
      </div>
      <hr className='w-full' />
    </div>
  )
}
