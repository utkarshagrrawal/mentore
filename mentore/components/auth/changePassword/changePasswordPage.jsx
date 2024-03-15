import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '../../global/loader';
import ChangePasswordBlock from './changePasswordBlock';

export function ChangePassword() {
    const [loading, setLoading] = useState(false);

    return (
        <div className='bg-[url("../../static/bg.jpg")] bg-cover min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8'>
            <Link to='/' className='relative'><img src="../static/logo.png" className="h-12 mix-blend-multiply" alt="Mentore" /></Link>
            {loading ? <Loader /> : <ChangePasswordBlock setLoading={setLoading} />}
        </div>
    );
}
