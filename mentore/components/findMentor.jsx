import { React } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Loader } from './loader';

export function FindMentor(){
    return (
        <div className='min-h-screen items-center flex flex-col'>
            <Link to='/' className='relative top-2'><img src="../static/logo.png" className="h-12 mix-blend-multiply" alt="Mentore" /></Link>
            <div className='w-full'>
                <div className='flex items-center bg-gradient-to-r from-blue-300 via-gray-300 to-yellow-300 h-24 my-10 mx-10 rounded-lg'>
                    
                </div>
            </div>
        </div>
    )
}