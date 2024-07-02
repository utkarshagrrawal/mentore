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
        "https://mentore-backend.vercel.app/user/details",
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
    <div className='bg-[url("https://static.vecteezy.com/system/resources/previews/001/437/080/non_2x/geometric-abstract-with-memphis-style-background-free-vector.jpg")] bg-cover min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8'>
      <Link to="/" className="relative">
        <img
          src="https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nby5wbmciLCJpYXQiOjE3MTIzNDQ0ODEsImV4cCI6MTc0Mzg4MDQ4MX0.R_a_H8TO26tJm794AbsCJzLN4tdFGyF2dIPrnYfWzzg&t=2024-04-05T19%3A14%3A41.780Z"
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
