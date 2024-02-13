import { React } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from './loader';
import Swal from 'sweetalert2';

export function ForgotPassword() {
    const [forgotPassword, setForgotPassword] = useState({ email: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForgotPassword({ ...forgotPassword, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        let forgotPasswordUser = await fetch('http://localhost:3000/forgotpassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(forgotPassword)
        })
        let result = await forgotPasswordUser.json();
        if (result.success) {
            Swal.fire(
                'Success',
                result.success,
                'success'
            )
            navigate('/login');
        } else {
            Swal.fire(
                'Error',
                result.error,
                'error'
            )
        }
        setLoading(false);
    }

    const forgotPasswordCode = (
        <>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Forgot your password?
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
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
                                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Send password reset email
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center">
                    Go back to <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 underline">sign in</Link>
                </div>
            </div>
        </>
    )

    return (
        <div className="flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 bg-gradient-to-r from-blue-300 via-gray-300 to-yellow-300">
            <Link to='/' className='absolute top-2'><img src="../static/logo.png" className="h-12 mix-blend-multiply" alt="Mentore" /></Link>
            {loading ? <Loader /> : forgotPasswordCode}
        </div>
    )
}