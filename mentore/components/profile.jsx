import { React } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TbLogout } from "react-icons/tb";
import { FaLock } from "react-icons/fa6";
import Select from 'react-select';
import Swal from 'sweetalert2';
import { Loader } from './loader';

export function Profile() {
  const user = useRef({});
  const allSkills = useRef([]);
  const mentorDetails = useRef([]);
  const [loading, setLoading] = useState(true);
  const [isMentor, setIsMentor] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      navigate('/login');
    }
    const getUser = async () => {
      let options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
      }
      let users = await fetch('http://localhost:3000/getcurrentuser', options);
      let result = await users.json();
      if (result.error) {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        Swal.fire(
          'Error',
          result.error,
          'error'
        )
        return navigate('/login');
      } else {
        user.current = result.result;
        if (user.current.type === 'mentor') {
          setIsMentor(true);
        }
      }
      setLoading(false);
    }
    getUser();
  }, [])

  useEffect(() => {
    const getSkills = async () => {
      let options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
      let skills = await fetch('http://localhost:3000/getallskills', options)
      let result = await skills.json();
      allSkills.current = result.result;
      setSkillsLoading(false);
    }
    getSkills();
  }, [])

  useEffect(() => {
    const getMentorDetails = async () => {
      let options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        }
      }
      let mentorDetail = await fetch('http://localhost:3000/getmentordetails', options)
      let result = await mentorDetail.json();
      if (result.error) {
        Swal.fire(
          'Error',
          result.error,
          'error'
        )
        return navigate('/login');
      }
      mentorDetails.current = result.result;
      setDetailsLoading(false);
    }
    if (isMentor) {
      getMentorDetails();
    }
  }, [isMentor])

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    navigate('/login');
  }

  const handleApprove = async (element) => {
    console.log(element.target.closest('tr'))
  }

  const handleReject = async (element) => {
    console.log(element.target)
  }

  const profilePage = (
    <>
      <div className='flex justify-center'>
        <Link to='/' className='relative top-3'><img src="../static/logo.png" className="h-12 mix-blend-multiply" alt="Mentore" /></Link>
      </div>
      <div className='w-full'>
        <div className='flex justify-between mx-14'>
          <Link to='/change-password' type="button" className="flex items-center gap-2 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1 text-center me-2 mb-2"><FaLock className='w-4 h-auto' /> Change password</Link>
          <button onClick={handleLogout} type="button" className="flex items-center gap-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1 text-center me-2 mb-2"><TbLogout className='w-6 h-auto' /> Logout</button>
        </div>
      </div>
      <div className='gap-4 grid grid-cols-4 lg:mx-14 mt-2'>
        <div className='w-full border-solid border-2 border-dark-500 rounded-lg'>
          <div className='flex flex-col items-center mx-4 lg:mx-16 my-10 h-48'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#362af4" className="w-48 auto">
              <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
            </svg>
            <h1 className='text-3xl font-semibold text-black'> {localStorage.getItem('name').charAt(0).toUpperCase() + localStorage.getItem('name').slice(1)} </h1>
          </div>
        </div>
        <div className='w-full col-span-3 border-solid border-2 border-dark-500 rounded-lg'>
          <div className='flex flex-col'>
            <div className='flex justify-center items-center'>
              <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                <h1 className='text-xl font-semibold text-black w-full my-4'> Email </h1>
                <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {user.current && user.current.email} </p>
              </div>
            </div>
            <div className='flex justify-center items-center'>
              <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                <h1 className='text-xl font-semibold text-black w-full my-4'> DOB </h1>
                <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {user.current && new Date(user.current.dob).toLocaleDateString()} </p>
              </div>
            </div>
            <div className='flex justify-center items-center'>
              <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                <h1 className='text-xl font-semibold text-black w-full my-4'> Type </h1>
                <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {user.current && user.current.type} </p>
              </div>
            </div>
            {(isMentor && !skillsLoading && !detailsLoading) ? (
              <>
                <div className='flex justify-center items-center'>
                  <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                    <h1 className='text-xl font-semibold text-black w-full my-4'> Position </h1>
                    <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {mentorDetails.current && mentorDetails.current.profession} </p>
                  </div>
                </div>
                <div className='flex justify-center items-center'>
                  <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                    <h1 className='text-xl font-semibold text-black w-full my-4'> Company </h1>
                    <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {mentorDetails.current && mentorDetails.current.company} </p>
                  </div>
                </div>
                <div className='flex justify-center items-center'>
                  <div className='grid grid-cols-4 w-full mx-10 mt-4'>
                    <h1 className='text-xl font-semibold text-black w-full my-4'> Experience </h1>
                    <p className='block w-full mx-auto rounded-md bg-gray-200 border-0 p-2 text-gray-900 min-w-fit shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 my-2 col-span-3'> {mentorDetails.current && (mentorDetails.current.experience + ' years')} </p>
                  </div>
                </div>
                <div className='flex justify-center items-center'>
                  <div className='grid grid-cols-4 w-full mx-10 my-4'>
                    <h1 className='text-xl font-semibold text-black w-full my-4'> Skills </h1>
                    <Select isMulti className="basic-multi-select w-full col-span-3" isDisabled={true}
                      classNamePrefix="select" defaultValue={mentorDetails.current && mentorDetails.current.skills.skills.map(skill => {
                        return { value: skill, label: skill }
                      })} options={
                        allSkills.current.map((skill) => {
                          return { value: skill.name, label: skill.name }
                        })} />
                  </div>
                </div>
              </>
            ) : ''}
          </div>
        </div>
      </div>

      <h1 className='text-center text-3xl font-bold my-8'>Pending Requests</h1>
      <div className='w-full'>
        <div className="relative overflow-x-auto mx-14 shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100 table-fixed">
            <thead className="text-xs text-white uppercase bg-blue-600 dark:text-white">
              <tr className='text-center'>
                <th scope="col" className="px-6 py-3">
                  Student name
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
                <th scope="col" className="px-6 py-3">
                  About
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-blue-400 text-center">
                <th scope="row" className="px-6 py-4 font-medium text-black whitespace-pre-line">
                  Ahmed darwish
                </th>
                <td className="px-6 py-4 text-black">
                  29/01/2024
                </td>
                <td className="px-6 py-4 text-black">
                  4PM
                </td>
                <td className="px-6 py-4 text-black">
                  machine learning
                </td>
                <td className="px-6 py-4 text-black">
                  <button onClick={event => handleApprove(event)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-4'>
                    Accept
                  </button>
                  <button onClick={event => handleReject(event)} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'>
                    Reject
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h1 className='text-center text-3xl font-bold my-8'>Upcoming Requests</h1>
      <div className='w-full'>
        <div className="relative overflow-x-auto mx-14 shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100 table-fixed">
            <thead className="text-xs text-white uppercase bg-blue-600 dark:text-white">
              <tr className='text-center'>
                <th scope="col" className="px-6 py-3">
                  Student name
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
                <th scope="col" className="px-6 py-3">
                  About
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-blue-400 text-center">
                <th scope="row" className="px-6 py-4 font-medium text-black whitespace-pre-line">
                  Ahmed darwish
                </th>
                <td className="px-6 py-4 text-black">
                  29/01/2024
                </td>
                <td className="px-6 py-4 text-black">
                  4PM
                </td>
                <td className="px-6 py-4 text-black">
                  machine learning
                </td>
                <td className="px-6 py-4 text-black">
                  <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-4' onClick={event => handleJoin(event)}>Join</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h1 className='text-center text-3xl font-bold my-8'>Completed Requests</h1>
      <div className='w-full mb-8'>
        <div className="relative overflow-x-auto mx-14 shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-blue-100 dark:text-blue-100 table-fixed">
            <thead className="text-xs text-white uppercase bg-blue-600 dark:text-white">
              <tr className='text-center'>
                <th scope="col" className="px-6 py-3">
                  Student name
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
                <th scope="col" className="px-6 py-3">
                  About
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-blue-400 text-center">
                <th scope="row" className="px-6 py-4 font-medium text-black whitespace-pre-line">
                  Ahmed darwish
                </th>
                <td className="px-6 py-4 text-black">
                  29/01/2024
                </td>
                <td className="px-6 py-4 text-black">
                  4PM
                </td>
                <td className="px-6 py-4 text-black">
                  machine learning
                </td>
                <td className="px-6 py-4 text-black">
                  <button className='bg-green-400 text-white font-bold py-2 px-4 rounded-full mr-4' disabled>Completed</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </>
  )

  return (
    <div className='flex justify-center items-center flex-col'>
      {loading ? <Loader /> : profilePage}
    </div>
  )
}
