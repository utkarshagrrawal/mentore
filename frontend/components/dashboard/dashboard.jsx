import React, { useState, useEffect } from "react";
import { Loader } from "../global/loader";

import BlogManagement from "./blogManagement";
import WebinarManagement from "./webinarManagement";
import Profile from "./profile";
import DashboardHeader from "../global/dashboardHeader";
import MentorBookings from "./mentorBookings";
import YourBookings from "./yourBookings";
import NewWebinar from "./newWebinar";
import NewBlog from "./newBlog";
import VerifyMentor from "./verifyMentor";

export function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [webinarDetailsLoading, setWebinarDetailsLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      let users = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/user/details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      let result = await users.json();
      if (result.error) {
        window.location.href = "/user/login";
        return;
      } else {
        setUser(result.result);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  return (
    <div className="flex justify-center items-center flex-col">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <DashboardHeader />

          {user && <Profile user={user} />}

          {user?.type === "mentor" && user?.verified && (
            <>
              <NewWebinar setWebinarDetailsLoading={setWebinarDetailsLoading} />

              <NewBlog setBlogsLoading={setBlogsLoading} />
            </>
          )}

          <YourBookings />

          {user?.type === "admin" && <VerifyMentor />}

          {user?.type === "mentor" && user?.verified && <MentorBookings />}

          {user?.type === "mentor" && user?.verified && (
            <WebinarManagement
              webinarDetailsLoading={webinarDetailsLoading}
              setWebinarDetailsLoading={setWebinarDetailsLoading}
            />
          )}

          {user?.type === "mentor" && user?.verified && (
            <BlogManagement
              blogsLoading={blogsLoading}
              setBlogsLoading={setBlogsLoading}
            />
          )}
        </div>
      )}
    </div>
  );
}
