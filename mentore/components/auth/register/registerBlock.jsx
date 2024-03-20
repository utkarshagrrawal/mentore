import React from "react";
import { useState } from "react";
import Select from 'react-select';
import { DismissToast, ErrorNotify, Loading, SuccessNotify } from "../../global/toast";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";


export function RegisterBlock({ register, setRegister, mentorSkills, setMentorSkills, isMentor, setIsMentor, loading, setLoading, allSkills }) {
    const conditions = {
        '1': 'Password must contain at least one uppercase letter',
        '2': 'Password must contain at least one lowercase letter',
        '3': 'Password must contain at least one digit',
        '4': 'Password must contain at least one special character',
        '5': 'Password must be at least 8 characters long'
    }

    const [eye, setEye] = useState(true);
    const [conditionsList, setConditionsList] = useState(conditions);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading({ ...loading, skillsLoading: true });
        const getSkills = async () => {
            const toastId = Loading('Fetching registeration fields for mentor')
            let options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            let skills = await fetch('https://mentore-ten.vercel.app/mentor/skill-options', options);
            let response = await skills.json();
            if (response.error) {
                ErrorNotify(response.error);
            } else {
                allSkills.current = response.result;
            }
            DismissToast(toastId);
            setLoading({ ...loading, skillsLoading: false });
        }
        if (isMentor) {
            getSkills();
        }
    }, [isMentor])

    useEffect(() => {
        if (isMentor) {
            setIsButtonDisabled(register.name && register.email && register.password && register.age && register.registerFor && register.profession && register.company && register.experience && mentorSkills.length > 0 ? false : true);
        } else {
            setIsButtonDisabled(register.name && register.email && register.password && register.age && register.registerFor ? false : true);
        }
    }, [register])

    const handleEye = () => {
        setEye(!eye);
    }

    const handleSelectChange = selectedOptions => {
        setMentorSkills(() => {
            return selectedOptions.map(option => {
                return option.value;
            })
        })
    }

    const handleChange = (e) => {
        setRegister({ ...register, [e.target.name]: e.target.value });
        if (e.target.name === 'registerFor') {
            if (e.target.value === 'mentor') {
                setIsMentor(true);
            } else {
                setIsMentor(false);
            }
        }
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
            <li key={index} className='text-sm font-semibold text-red-500'>{conditionsList[key]}</li>
        )
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date().getFullYear() - new Date(register.age).getFullYear() < 18) {
            return ErrorNotify('You must be at least 18 years old to register');
        }
        if (conditions.length > 0) {
            return ErrorNotify('Please enter a strong password');
        }
        if (isMentor && mentorSkills.length === 0) {
            return ErrorNotify('Please select at least one skill');
        }
        if (isMentor && register.experience < 1) {
            return ErrorNotify('Please enter a valid experience');
        }

        setLoading({ ...loading, webLoading: true });

        let sendData = await fetch('https://mentore-ten.vercel.app/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: register.name,
                email: register.email,
                password: register.password,
                age: register.age,
                registerFor: register.registerFor,
                profession: register.profession,
                company: register.company,
                experience: register.experience,
                skills: register.registerFor === 'mentor' ? mentorSkills : []
            })
        })

        let resp = await sendData.json();
        if (resp.error) {
            ErrorNotify(resp.error);
        } else {
            SuccessNotify('You have been registered successfully');
            navigate('/user/login');
        }
        setLoading({ ...loading, webLoading: false });
    }


    return (
        <div className="border-2 border-gray-300 mt-3 px-6 py-8 w-full md:w-[75%] lg:w-1/3 flex flex-col bg-white rounded-xl shadow-2xl">
            <div className="sm:w-full">
                <h2 className="mt-4 text-center text-3xl font-bold leading-9 text-gray-900">
                    Register for an account
                </h2>
            </div>
            <div className="mt-8 sm:w-full">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                onChange={handleChange}
                                value={register.name}
                                required
                                autoFocus
                                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor='age' className='block text-sm font-medium leading-6 text-gray-900'>
                            Age
                        </label>
                        <div className='mt-2'>
                            <input
                                id='age'
                                name='age'
                                type='date'
                                autoComplete='age'
                                onChange={handleChange}
                                value={register.age}
                                required
                                className='block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mt-2 flex justify-between">
                            <label htmlFor="registerFor" className='block text-sm font-medium leading-6 text-gray-900'>
                                Register as
                            </label>
                            <div>
                                <input type='radio' id='mentor' name='registerFor' value='mentor' onChange={handleChange} className='mr-2' required />
                                <label htmlFor='mentor' className='mr-4'>Mentor</label>
                                <input type='radio' id='mentee' name='registerFor' value='mentee' onChange={handleChange} className='mr-2' required />
                                <label htmlFor='mentee'>Mentee</label>
                            </div>
                        </div>
                    </div>

                    {(isMentor && !loading.skillsLoading) ? (
                        <>
                            <div>
                                <label htmlFor="skills" className="block text-sm font-medium leading-6 text-gray-900">
                                    Skills
                                </label>
                                <div className="mt-2">
                                    <Select isMulti className="basic-multi-select w-full" id='skills' name='skills'
                                        classNamePrefix="select"
                                        options={
                                            allSkills.current.map((skill) => {
                                                return { value: skill.name, label: skill.name }
                                            })}
                                        onChange={handleSelectChange}
                                        required />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="profession" className="block text-sm font-medium leading-6 text-gray-900">
                                    Profession
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="profession"
                                        name="profession"
                                        type="text"
                                        autoComplete="profession"
                                        onChange={handleChange}
                                        value={register.profession}
                                        required
                                        className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium leading-6 text-gray-900">
                                    Company
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        autoComplete="company"
                                        onChange={handleChange}
                                        value={register.company}
                                        required
                                        className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium leading-6 text-gray-900">
                                    Experience
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="experience"
                                        name="experience"
                                        type="number"
                                        autoComplete="experience"
                                        onChange={handleChange}
                                        value={register.experience}
                                        required
                                        min={0}
                                        className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </>
                    ) : null}

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
                                value={register.email}
                                required
                                className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <div className='flex items-center relative'>
                                <input
                                    id="password"
                                    name="password"
                                    type={eye ? "password" : "text"}
                                    onChange={handleChange}
                                    value={register.password}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {eye ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 absolute right-3" onClick={handleEye}>
                                        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
                                    </svg>
                                ) :
                                    (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 absolute right-3" onClick={handleEye}>
                                            <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clipRule="evenodd" />
                                            <path d="m10.748 13.93 2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
                                        </svg>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div className={`py-2 rounded-md ${register.password.length > 0 && conditionsList ? 'block' : 'hidden'}`}>
                        {passwordConditions}
                    </div>

                    <div>
                        <button disabled={isButtonDisabled} type="submit" className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                            Register
                        </button>
                    </div>
                    <p className="text-sm text-center text-gray-600">
                        Already have an account? <Link to="/user/login" className="font-semibold text-indigo-600 hover:text-indigo-500 underline">Login</Link>
                    </p>
                </form>
            </div >
        </div>
    )
}