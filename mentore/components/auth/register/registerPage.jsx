import { React, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader } from '../../global/loader';
import { RegisterBlock } from './registerBlock';

export function Register() {
    const [register, setRegister] = useState({ name: '', email: '', password: '', age: '', registerFor: '', profession: '', company: '', experience: 0 });
    const [mentorSkills, setMentorSkills] = useState([]);
    const [loading, setLoading] = useState({ webLoading: false, skillsLoading: true });
    const [isMentor, setIsMentor] = useState(false);
    const allSkills = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            let user = await fetch('https://mentore-ten.vercel.app/user/details', {
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
        <div className='bg-[url("https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/bg.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvYmcuanBnIiwiaWF0IjoxNzExMTg4NzQ5LCJleHAiOjE3NDI3MjQ3NDl9.DxHTmGDNLY9mndHvmDPeCFY3htzmCC9W8n99fDV3PBE&t=2024-03-23T10%3A12%3A29.169Z")] bg-cover min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8'>
            <Link to='/' className='relative'><img src="https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nby5wbmciLCJpYXQiOjE3MTExODg4NzQsImV4cCI6MTc0MjcyNDg3NH0.KFDnSmauZ-GWjuA9Si0SajJG2a0iizGTKlpVZVjZYQg&t=2024-03-23T10%3A14%3A34.573Z" className="h-12 mix-blend-multiply" alt="Mentore" /></Link>
            {loading.webLoading ? <Loader /> : <RegisterBlock register={register} setRegister={setRegister} mentorSkills={mentorSkills} setMentorSkills={setMentorSkills} isMentor={isMentor} setIsMentor={setIsMentor} loading={loading} setLoading={setLoading} allSkills={allSkills} />}
        </div>
    )
}
