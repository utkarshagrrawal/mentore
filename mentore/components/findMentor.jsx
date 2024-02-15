import { React } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Loader } from './loader';

export function FindMentor() {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
  }

  return (
    <div className='min-h-screen items-center flex flex-col w-full'>
      <div className='w-full bg-[#d2d2d217]'>
        <div className='flex flex-wrap justify-center items-center md:justify-between lg:justify-between mx-16 my-6'>
          <Link to='/'><img src="../static/logo.png" className="h-8 mix-blend-multiply" alt="Mentore" /></Link>
          <form onSubmit={handleSearch}>
            <input type='search' placeholder='Search for mentors' className='lg:w-[40rem] md:w-[26rem] w-[16rem] border-2 border-blue-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-4 focus:ring-blue-300' />
          </form>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3'>Login</button>
        </div>
      </div>
      <hr className='w-full' />
      <div className='w-full'>
        <h1 className='text-4xl font-semibold text-center my-4'>View mentors</h1>
        <div className='w-full mb-8'>
          <div className='grid lg:grid-cols-3  md:grid-cols-2 grid-cols-1'>

            <div class="max-w-sm mx-16 px-4 pt-8 pb-3 bg-gray-100 mb-8 border border-gray-200 rounded-2xl shadow">
              <img class="rounded-t-lg h-48 object-contain w-full" src="https://cdn-icons-png.flaticon.com/512/147/147140.png" alt="" />
              <div class="p-5">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-center">Kumar piyush</h5>
                <p class="font-normal text-gray-700 dark:text-gray-400 text-center">SDE-3, Google</p>
                <p class="font-normal text-gray-700 dark:text-gray-400 text-center">Experience: 4 years</p>
                <Link to="#" class="flex justify-center w-full items-center mt-8 px-3 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                  View details
                </Link>
              </div>
            </div>

            <div class="max-w-sm mx-16 px-4 pt-8 pb-3 bg-gray-100 mb-8 border border-gray-200 rounded-2xl shadow">
              <img class="rounded-t-lg h-48 object-contain w-full" src="https://cdn-icons-png.flaticon.com/512/147/147140.png" alt="" />
              <div class="p-5">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-center">Kumar piyush</h5>
                <p class="font-normal text-gray-700 dark:text-gray-400 text-center">SDE-3, Google</p>
                <p class="font-normal text-gray-700 dark:text-gray-400 text-center">Experience: 4 years</p>
                <Link to="#" class="flex justify-center w-full items-center mt-8 px-3 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                  View details
                </Link>
              </div>
            </div>

            <div class="max-w-sm mx-16 px-4 pt-8 pb-3 bg-gray-100 mb-8 border border-gray-200 rounded-2xl shadow">
              <img class="rounded-t-lg h-48 object-contain w-full" src="https://cdn-icons-png.flaticon.com/512/147/147140.png" alt="" />
              <div class="p-5">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 text-center">Kumar piyush</h5>
                <p class="font-normal text-gray-700 dark:text-gray-400 text-center">SDE-3, Google</p>
                <p class="font-normal text-gray-700 dark:text-gray-400 text-center">Experience: 4 years</p>
                <Link to="#" class="flex justify-center w-full items-center mt-8 px-3 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                  View details
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
