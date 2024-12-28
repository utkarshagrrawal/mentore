import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../global/header";
import Content from "./content";
import Comments from "./comments";

export function Blog() {
  const user = useRef([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const { id } = useParams();

  // checks if the user is logged in
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
      const result = await users.json();
      if (result.error) {
        setLoggedIn(false);
      } else {
        user.current = result.result;
        setLoggedIn(true);
      }
    };
    getUser();
  }, []);

  return (
    <>
      <Header loggedIn={loggedIn} />

      <Content blogId={id} />

      <Comments blogId={id} user={user} />
    </>
  );
}
