import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorNotify, SuccessNotify } from '../../global/toast';


export function LoginBlock({ login, setLogin, setLoading }) {
    const [eye, setEye] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const navigate = useNavigate();

    const handleEye = () => {
        setEye(!eye);
    }

    const handleChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        setIsButtonDisabled(login.email && login.password ? false : true);
    }, [login])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let loginUser = await fetch('https://mentore-ten.vercel.app/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(login)
        })
        let result = await loginUser.json();
        if (result.success) {
            SuccessNotify("Logged in successfully")
            navigate('/');
        } else {
            ErrorNotify(result.error);
        }
        setLoading(false);
    }

    return (
        <div className="border-2 border-gray-300 mt-3 px-6 py-8 w-full md:w-[75%] lg:w-1/3 flex flex-col bg-white rounded-xl shadow-2xl">
            <div className="sm:w-full">
                <h2 className="mt-4 text-center text-3xl font-bold leading-9 text-gray-900">
                    Sign in to your account
                </h2>
            </div>
            <div className="mt-8 sm:w-full">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                onChange={handleChange}
                                value={login.email}
                                required
                                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-col sm:flex-row justify-between items-center">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <Link to="/user/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className='flex items-center relative'>
                                <input
                                    id="password"
                                    name="password"
                                    type={eye ? "password" : "text"}
                                    onChange={handleChange}
                                    value={login.password}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {eye ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 absolute right-3 cursor-pointer text-gray-400" onClick={handleEye}>
                                        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
                                    </svg>
                                ) :
                                    (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 absolute right-3 cursor-pointer text-gray-400" onClick={handleEye}>
                                            <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clipRule="evenodd" />
                                            <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                                        </svg>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            disabled={isButtonDisabled}
                            type="submit"
                            className={`w-full py-3 rounded-md bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-500 focus:ring-indigo-500 focus:ring-offset-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-opacity-50 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            Sign in
                        </button>
                    </div>
                    <p className="text-sm text-center text-gray-600">
                        Don't have an account? <Link to="/user/register" className="font-semibold text-indigo-600 hover:text-indigo-500 underline">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}