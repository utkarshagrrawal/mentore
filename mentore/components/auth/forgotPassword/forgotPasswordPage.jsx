import { React } from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from '../../global/loader';
import { VerifyOtp } from './verifyOtp';
import { RequestOtp } from './requestOtp';

export function ForgotPassword() {
    const [forgotPassword, setForgotPassword] = useState({ email: '', otp: '' });
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            let user = await fetch('https://mentore-ten.vercel.app/user/details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            });
            let result = await user.json();
            if (result.error) {
                localStorage.removeItem('token');
                return;
            } else {
                navigate('/');
            }
        }
        getUser();
    }, [])

    const handleChange = (e) => {
        if (e.target.name === 'email') {
            setForgotPassword({ ...forgotPassword, [e.target.name]: e.target.value });
        } else {
            const regex = /^[0-9\b]+$/;
            if (e.target.value === '' || regex.test(e.target.value) && e.target.value.length <= 6) {
                setForgotPassword({ ...forgotPassword, [e.target.name]: e.target.value });
            }
        }
    }

    return (
        <div className='bg-[url("https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/bg.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvYmcuanBnIiwiaWF0IjoxNzExMTg4NzQ5LCJleHAiOjE3NDI3MjQ3NDl9.DxHTmGDNLY9mndHvmDPeCFY3htzmCC9W8n99fDV3PBE&t=2024-03-23T10%3A12%3A29.169Z")] bg-cover min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8'>
            <Link to='/' className='relative'><img src="https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nby5wbmciLCJpYXQiOjE3MTExODg4NzQsImV4cCI6MTc0MjcyNDg3NH0.KFDnSmauZ-GWjuA9Si0SajJG2a0iizGTKlpVZVjZYQg&t=2024-03-23T10%3A14%3A34.573Z" className="h-12 mix-blend-multiply" alt="Mentore" /></Link>
            {loading ? <Loader /> : emailSent ? <VerifyOtp handleChange={handleChange} setLoading={setLoading} forgotPassword={forgotPassword} /> : <RequestOtp handleChange={handleChange} setLoading={setLoading} setEmailSent={setEmailSent} forgotPassword={forgotPassword} />}
        </div>
    )
}
