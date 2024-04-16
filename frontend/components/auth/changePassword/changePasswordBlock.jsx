import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DismissToast, ErrorNotify, Loading, SuccessNotify } from "../../global/toast";


export default function ChangePasswordBlock({ setLoading }) {
    const conditions = {
        '1': 'Password must contain at least one uppercase letter',
        '2': 'Password must contain at least one lowercase letter',
        '3': 'Password must contain at least one digit',
        '4': 'Password must contain at least one special character',
        '5': 'Password must be at least 8 characters long'
    }
    const [conditionsList, setConditionsList] = useState(conditions);
    const [password, setPassword] = useState({ oldPassword: '', password: '', confirmPassword: '' });
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value })
        if (e.target.name === 'password') {
            const password = e.target.value;

            const containsUppercase = /[A-Z]/.test(password);
            const containsLowercase = /[a-z]/.test(password);
            const containsDigit = /\d/.test(password);
            const containsSpecialChar = /[@$!%*?&#]/.test(password);
            const isLongEnough = password.length >= 8;

            if (containsUppercase) {
                delete conditions['1'];
            } else {
                conditions['1'] = 'Password must contain at least one uppercase letter';
            }
            if (containsLowercase) {
                delete conditions['2'];
            } else {
                conditions['2'] = 'Password must contain at least one lowercase letter';
            }
            if (containsDigit) {
                delete conditions['3'];
            } else {
                conditions['3'] = 'Password must contain at least one digit';
            }
            if (containsSpecialChar) {
                delete conditions['4'];
            } else {
                conditions['4'] = 'Password must contain at least one special character';
            }
            if (isLongEnough) {
                delete conditions['5'];
            } else {
                conditions['5'] = 'Password must be at least 8 characters long';
            }
            setConditionsList(conditions);
        }
    }

    let passwordConditions = Object.keys(conditionsList).map((key, index) => {
        return (
            <li key={index} className='text-sm font-semibold text-red-600'>{conditionsList[key]}</li>
        )
    })

    useEffect(() => {
        setIsButtonDisabled(Object.keys(conditionsList).length > 0 || password.password.length === 0 || password.confirmPassword.length === 0 || password.oldPassword.length === 0 ? true : false);
    }, [password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.password !== password.confirmPassword) {
            return ErrorNotify("Passwords do not match");
        }
        const toastId = Loading("Changing password...");
        setLoading(true);
        let changePassword = await fetch('https://mentore-backend.vercel.app//user/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(password)
        })
        let response = await changePassword.json();
        DismissToast(toastId);
        if (response.error) {
            ErrorNotify(response.error);
        } else {
            SuccessNotify("Password changed successfully")
            navigate('/user/dashboard');
        }
        setLoading(false);
    }

    return (
        <div className="border-2 border-gray-300 mt-3 px-6 py-8 w-full md:w-[75%] lg:w-1/3 flex flex-col bg-white rounded-xl shadow-2xl">
            <div className="sm:w-full">
                <h2 className="mt-4 text-center text-3xl font-bold leading-9 text-gray-900">
                    Change password
                </h2>
            </div>
            <div className="mt-10 sm:w-full">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="oldPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            Old password
                        </label>
                        <div className="mt-2">
                            <input
                                id="oldPassword"
                                name="oldPassword"
                                type="password"
                                value={password.oldPassword}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password.password}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className={`py-2 rounded-md ${password.password.length > 0 && Object.keys(conditionsList).length > 0 ? 'block' : 'hidden'} `}>
                        {passwordConditions}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            Confirm password
                        </label>
                        <div className="mt-2">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={password.confirmPassword}
                                onChange={handleChange}
                                required
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
                            Change password
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    Go back to <Link to="/user/dashboard" className="font-medium text-indigo-600 hover:text-indigo-500 underline">dashboard</Link>
                </div>
            </div>
        </div>
    )
}