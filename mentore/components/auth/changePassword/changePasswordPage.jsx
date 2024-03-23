import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '../../global/loader';
import ChangePasswordBlock from './changePasswordBlock';

export function ChangePassword() {
    const [loading, setLoading] = useState(false);

    return (
        <div className='bg-[url("https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/bg.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvYmcuanBnIiwiaWF0IjoxNzExMTg4NzQ5LCJleHAiOjE3NDI3MjQ3NDl9.DxHTmGDNLY9mndHvmDPeCFY3htzmCC9W8n99fDV3PBE&t=2024-03-23T10%3A12%3A29.169Z")] bg-cover min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8'>
            <Link to='/' className='relative'><img src="https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nby5wbmciLCJpYXQiOjE3MTExODg4NzQsImV4cCI6MTc0MjcyNDg3NH0.KFDnSmauZ-GWjuA9Si0SajJG2a0iizGTKlpVZVjZYQg&t=2024-03-23T10%3A14%3A34.573Z" className="h-12 mix-blend-multiply" alt="Mentore" /></Link>
            {loading ? <Loader /> : <ChangePasswordBlock setLoading={setLoading} />}
        </div>
    );
}
