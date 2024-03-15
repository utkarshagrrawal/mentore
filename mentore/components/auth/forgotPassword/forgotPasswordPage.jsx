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
            let user = await fetch('http://localhost:3000/user/details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            let result = await user.json();
            if (result.error) {
                return;
            } else {
                navigate('/');
            }
        }
        getUser();
    }, [])

    const handleChange = (e) => {
        if(e.target.name === 'email'){
            setForgotPassword({ ...forgotPassword, [e.target.name]: e.target.value });
        } else{
            const regex = /^[0-9\b]+$/;
            if (e.target.value === '' || regex.test(e.target.value) && e.target.value.length <= 6) {
                setForgotPassword({ ...forgotPassword, [e.target.name]: e.target.value });
            }
        }
    }

    return (
        <div className='bg-[url("../../static/bg.jpg")] bg-cover min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8'>
            <Link to='/' className='relative'><img src="../static/logo.png" className="h-12 mix-blend-multiply" alt="Mentore" /></Link>
            {loading ? <Loader /> : emailSent ? <VerifyOtp handleChange={handleChange} setLoading={setLoading} forgotPassword={forgotPassword} /> : <RequestOtp handleChange={handleChange} setLoading={setLoading} setEmailSent={setEmailSent} forgotPassword={forgotPassword} />}
        </div>
    )
}
