import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { ErrorNotify, SuccessNotify } from "../../global/toast";

export function RequestOtp({ forgotPassword, handleChange, setLoading, setEmailSent }) {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        if (forgotPassword.email) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [forgotPassword])

    const handleRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        let forgotPasswordUser = await fetch('https://mentore-ten.vercel.app/user/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(forgotPassword)
        })
        let result = await forgotPasswordUser.json();
        if (result.success) {
            SuccessNotify(result.success);
            setEmailSent(true);
        } else {
            ErrorNotify(result.error);
        }
        setLoading(false);
    }

    return (
        <div className="border-2 border-gray-300 mt-3 px-6 py-8 w-full md:w-[75%] lg:w-1/3 flex flex-col bg-white rounded-xl shadow-2xl">
            <div className="sm:w-full">
                <h2 className="mt-4 text-center text-3xl font-bold leading-9 text-gray-900">
                    Forgot your password?
                </h2>
            </div>
            <div className="mt-10 sm:w-full">
                <form className="space-y-6" onSubmit={handleRequest}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={forgotPassword.email}
                                onChange={handleChange}
                                required
                                autoFocus
                                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            disabled={isButtonDisabled}
                            type="submit"
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isButtonDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                            Send reset code
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    Go back to <Link to="/user/login" className="font-medium text-indigo-600 hover:text-indigo-500 underline">sign in</Link>
                </div>
            </div>
        </div>
    )
}