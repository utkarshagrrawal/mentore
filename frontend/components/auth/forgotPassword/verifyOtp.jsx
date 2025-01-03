import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorNotify, SuccessNotify } from "../../global/toast";

export function VerifyOtp({ forgotPassword, handleChange, setLoading }) {
  const navigate = useNavigate();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (forgotPassword.otp.length === 6) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [forgotPassword]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    let verifyOtp = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/user/verifyotp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(forgotPassword),
      }
    );
    let result = await verifyOtp.json();
    if (result.success) {
      SuccessNotify("Password reset successfull");
      navigate("/user/login");
    } else {
      ErrorNotify(result.error || "Error verifying OTP");
    }
    setLoading(false);
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    let resendOtp = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/user/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(forgotPassword),
      }
    );
    let result = await resendOtp.json();
    if (result.success) {
      SuccessNotify("OTP sent successfully");
    } else {
      ErrorNotify(result.error || "Error sending OTP");
    }
    setLoading(false);
  };

  return (
    <div className="border border-gray-100 mt-3 px-6 py-8 w-full max-w-md flex flex-col bg-white rounded-xl shadow-sm">
      <div className="sm:w-full">
        <h2 className="mt-4 text-center text-3xl font-bold leading-9 text-gray-900">
          Forgot your password?
        </h2>
      </div>
      <div className="mt-10 sm:w-full">
        <form className="space-y-6" onSubmit={handleVerify}>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              OTP
            </label>
            <div className="mt-2">
              <input
                id="otp"
                name="otp"
                type="text"
                value={forgotPassword.otp}
                onChange={handleChange}
                required
                placeholder="XXXXXX"
                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="flex justify-end text-sm">
              <button
                onClick={handleResend}
                className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                Resend OTP
              </button>
            </div>
          </div>

          <div>
            <button
              disabled={isButtonDisabled}
              type="submit"
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isButtonDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              Verify
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          Go back to{" "}
          <Link
            to="/user/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 underline"
          >
            sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
