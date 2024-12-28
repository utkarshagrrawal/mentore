import { React } from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../global/loader";
import { LoginBlock } from "./loginBlock";

export function Login() {
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      let user = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/user/details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      let result = await user.json();
      if (!result.error) {
        navigate("/");
      }
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8 bg-gray-100">
      <Link to="/" className="relative">
        <img
          src="https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/mentore.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWVudG9yZS5qcGciLCJpYXQiOjE3MzAxODUwOTQsImV4cCI6MTg4Nzg2NTA5NH0.kJcsFJEOAC4hrV88B9d0FnDp1wgpntRboWfe0RIJAOo&t=2024-10-29T06%3A58%3A14.455Z"
          className="h-20 w-auto mix-blend-multiply"
          alt="Mentore"
        />
      </Link>
      {loading ? (
        <Loader />
      ) : (
        <LoginBlock login={login} setLogin={setLogin} setLoading={setLoading} />
      )}
    </div>
  );
}
