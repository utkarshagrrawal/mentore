import { React } from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-4xl font-bold'>404</h1>
            <p className='text-2xl'>Page not found</p>
            <Link to='/' className='mt-4 text-blue-500'>Go back to home</Link>
        </div>
    )
}
