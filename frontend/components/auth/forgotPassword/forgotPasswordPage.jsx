import { React } from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../global/loader";
import { VerifyOtp } from "./verifyOtp";
import { RequestOtp } from "./requestOtp";

export function ForgotPassword() {
  const [forgotPassword, setForgotPassword] = useState({ email: "", otp: "" });
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      let user = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/user/details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      let result = await user.json();
      if (result.error) {
        localStorage.removeItem("token");
        return;
      } else {
        navigate("/");
      }
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setForgotPassword({ ...forgotPassword, [e.target.name]: e.target.value });
    } else {
      const regex = /^[0-9\b]+$/;
      if (
        e.target.value === "" ||
        (regex.test(e.target.value) && e.target.value.length <= 6)
      ) {
        setForgotPassword({
          ...forgotPassword,
          [e.target.name]: e.target.value,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8">
      <Link to="/" className="relative">
        <img
          src="https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/mentore.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWVudG9yZS5qcGciLCJpYXQiOjE3MzAxODUwOTQsImV4cCI6MTg4Nzg2NTA5NH0.kJcsFJEOAC4hrV88B9d0FnDp1wgpntRboWfe0RIJAOo&t=2024-10-29T06%3A58%3A14.455Z"
          className="h-20 w-auto mix-blend-multiply"
          alt="Mentore"
        />
      </Link>
      {loading ? (
        <Loader />
      ) : emailSent ? (
        <VerifyOtp
          handleChange={handleChange}
          setLoading={setLoading}
          forgotPassword={forgotPassword}
        />
      ) : (
        <RequestOtp
          handleChange={handleChange}
          setLoading={setLoading}
          setEmailSent={setEmailSent}
          forgotPassword={forgotPassword}
        />
      )}
    </div>
  );
}
