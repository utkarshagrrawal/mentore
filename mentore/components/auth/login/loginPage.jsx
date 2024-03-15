import { React } from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from '../../global/loader';
import { LoginBlock } from './loginBlock';

export function Login() {
    const [login, setLogin] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async () => {
            let user = await fetch('http://localhost:3000/user/details', {
                method: "GET",
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

    return (
        <div className='bg-[url("../../static/bg.jpg")] bg-cover min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8'>
            <Link to='/' className='relative'><img src="../static/logo.png" className="h-12 mix-blend-multiply" alt="Mentore" /></Link>
            {loading ? <Loader /> : <LoginBlock login={login} setLogin={setLogin} setLoading={setLoading} />}
        </div>
    )
}
