import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function Insights() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState({ blogsLoading: true });
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10);
  const allBlogs = useRef([]);
  const navigate = useNavigate();

<<<<<<< Updated upstream
    useEffect(() => {
        const getUser = async () => {
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            let users = await fetch("http://localhost:3000/getcurrentuser", options);
            const result = await users.json();
            if (result.error) {
                setLoggedIn(false);
            } else {
                setLoggedIn(true);
            }
=======
  useEffect(() => {
    const getUser = async () => {
      try {
        let options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
>>>>>>> Stashed changes
        };
        let users = await fetch(
          "http://localhost:3000/getcurrentuser",
          options,
        );
        const result = await users.json();
        if (result.error) {
          setLoggedIn(false);
          localStorage.removeItem("token");
          localStorage.removeItem("name");
          localStorage.removeItem("email");
        } else {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getBlogs = async () => {
      setLoading({ ...loading, blogsLoading: true });
      try {
        let options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        let blogs = await fetch("http://localhost:3000/getallblogs", options);
        const response = await blogs.json();
        if (response.error) {
          Swal.fire(
            "Error",
            "Some error occurred while fetching blogs",
            "error",
          );
        } else {
          allBlogs.current = response.result;
        }
        setLoading({ ...loading, blogsLoading: false });
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    getBlogs();
  }, []);

  const handleLike = async (blogId) => {
    try {
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogID: blogId }),
      };

      let response = await fetch("http://localhost:3000/like", options);
      let result = await response.json();

      if (result.success) {
        // Update the local state with the new like count
        const updatedBlogs = allBlogs.current.map((blog) => {
          if (blog.id === blogId) {
            return { ...blog, likes: blog.likes + 1 };
          }
          return blog;
        });

        allBlogs.current = updatedBlogs;
        setLoading({ ...loading, blogsLoading: false });
      } else {
        Swal.fire("Error", "Failed to like the blog", "error");
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleComment = async (blogId, comment) => {
    try {
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogID: blogId, comment }),
      };

      let response = await fetch("http://localhost:3000/comment", options);
      let result = await response.json();

      if (result.success) {
        // Update the local state with the new comment
        const updatedBlogs = allBlogs.current.map((blog) => {
          if (blog.id === blogId) {
            return { ...blog, comments: [...blog.comments, comment] };
          }
          return blog;
        });

        allBlogs.current = updatedBlogs;
        setLoading({ ...loading, blogsLoading: false });
      } else {
        Swal.fire("Error", "Failed to add comment", "error");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = allBlogs.current.slice(
    indexOfFirstBlog,
    indexOfLastBlog,
  );

  const handleLogButton = () => {
    if (loggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      {/* Header Section */}
      <div className="w-full bg-[#d2d2d217]">
        <div className="my-3 flex flex-wrap items-center justify-center md:mx-16 md:justify-between lg:mx-16 lg:justify-between">
          <Link to="/">
            <img
              src="../static/logo.png"
              className="h-8 mix-blend-multiply"
              alt="Mentore"
            />
          </Link>
          <input
            type="search"
            placeholder="Search for mentors"
            className="w-[16rem] rounded-lg border-2 border-blue-700 px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300 md:w-[26rem] lg:w-[40rem]"
          />
          <button
            onClick={handleLogButton}
            className="rounded-lg bg-blue-700 px-8 py-3 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {loggedIn ? "Dashboard" : "Login"}
          </button>
        </div>
      </div>
      <hr className="w-full" />

      {/* Main Content Section */}
      <div className="w-full">
        <div className="mx-16 my-3 flex w-full flex-wrap items-center justify-center">
          <h1 className="mr-16 text-4xl font-bold">Insights</h1>
        </div>
        <div className="my-3 flex w-full flex-wrap items-center justify-center">
          {/* Left 1/4 for sorting options (you can customize this part) */}
          <div className="mx-16 w-[25%]">{/* Add sorting options here */}</div>

          {/* Right 3/4 for blog cards */}
          <div className="mx-16 w-full">
            {!loading.blogsLoading &&
              currentBlogs.map((blog, index) => (
                <div
                  key={index}
                  className="mb-4 max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow"
                >
                  <h3 className="mb-2 text-xl font-bold">{blog.title}</h3>
                  <p className="mb-2 text-gray-600">By {blog.name}</p>
                  <div
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                    className="mb-2 max-h-16 overflow-hidden text-gray-700"
                  ></div>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="text-blue-700 hover:underline"
                  >
                    View More
                  </Link>
                  {/* Like, Dislike, Comment section */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleLike(blog.id)}
                        className="mr-2"
                      >
                        Like
                      </button>
                      <span>{blog.likes} Likes</span>
                    </div>
                    <button className="mr-2">Dislike</button>
                    <button
                      onClick={() => handleComment(blog.id, "Your comment")}
                      className="mr-2"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
