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
            let user = await fetch('https://mentore-ten.vercel.app/user/details', {
                method: "GET",
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

    return (
        <div className='bg-[url("https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/bg.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvYmcuanBnIiwiaWF0IjoxNzExMTg4NzQ5LCJleHAiOjE3NDI3MjQ3NDl9.DxHTmGDNLY9mndHvmDPeCFY3htzmCC9W8n99fDV3PBE&t=2024-03-23T10%3A12%3A29.169Z")] bg-cover min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8'>
            <Link to='/' className='relative'><img src="https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nby5wbmciLCJpYXQiOjE3MTIzNDQ0ODEsImV4cCI6MTc0Mzg4MDQ4MX0.R_a_H8TO26tJm794AbsCJzLN4tdFGyF2dIPrnYfWzzg&t=2024-04-05T19%3A14%3A41.780Z" className="h-12 mix-blend-multiply" alt="Mentore" /></Link>
            {loading ? <Loader /> : <LoginBlock login={login} setLogin={setLogin} setLoading={setLoading} />}
        </div>
    )
}
