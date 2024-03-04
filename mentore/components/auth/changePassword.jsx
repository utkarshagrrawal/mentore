import React from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from '../global/loader';
import { FaCheck } from "react-icons/fa";

export function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [password, setPassword] = useState({ oldPassword: '', password: '', confirmPassword: '' });
    const conditions = {
        '1': 'Password must contain at least one uppercase letter',
        '2': 'Password must contain at least one lowercase letter',
        '3': 'Password must contain at least one digit',
        '4': 'Password must contain at least one special character',
        '5': 'Password must be at least 8 characters long'
    }
    const [conditionalList, setConditionalList] = useState(conditions);

    const handleChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value })
        if (e.target.name === 'password') {
            const password = e.target.value;

            if (password.length > 0) {
                document.getElementById('passwordStrengthPointsDiv').style.display = 'block';
            } else {
                document.getElementById('passwordStrengthPointsDiv').style.display = 'none';
            }

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
            setConditionalList(conditions);
        }
    }

    let passwordConditions = Object.keys(conditionalList).map((key, index) => {
        return (
            <li key={index} className='text-sm font-semibold text-red-600'>{conditionalList[key]}</li>
        )
    })

    if (passwordConditions.length === 0) {
        passwordConditions = <h1 className='flex items-center gap-2 text-sm font-semibold text-green-600'><FaCheck />Password is strong</h1>
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (password.password !== password.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match',
            })
            return;
        }
        setLoading(true);
        let changePassword = await fetch('http://localhost:3000/changepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(password)
        })
        let response = await changePassword.json();
        if (response.error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.error,
            })
        } else {
            Swal.fire(
                'Success',
                'Password changed successfully',
                'success'
            )
            navigate('/dashboard');
        }
        setLoading(false);
    }

    const changePasswordCode = (
        <div className='border-2 border-black mt-3 py-4 w-1/3 flex flex-col bg-white rounded-xl'>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Change password
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleChangePassword}>
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
                    <div className='py-2 rounded-md hidden' id='passwordStrengthPointsDiv'>
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
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Change password
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    Go back to <Link to="/dashboard" className="font-medium text-indigo-600 hover:text-indigo-500 underline">dashboard</Link>
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 bg-gradient-to-r from-blue-300 via-gray-300 to-yellow-300">
            <Link to='/' className='relative'><img src="../static/logo.png" className="h-12 mix-blend-multiply" alt="Mentore" /></Link>
            {loading ? <Loader /> : changePasswordCode}
        </div>
    );
}
