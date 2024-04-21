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
            let user = await fetch('https://mentore-backend.vercel.app/user/details', {
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
        <div className='bg-[url("https://static.vecteezy.com/system/resources/previews/001/437/080/non_2x/geometric-abstract-with-memphis-style-background-free-vector.jpg")] bg-cover min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8'>
            <Link to='/' className='relative'><img src="https://mwhhseuqzoudvibeyvrm.supabase.co/storage/v1/object/sign/images/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbG9nby5wbmciLCJpYXQiOjE3MTIzNDQ0ODEsImV4cCI6MTc0Mzg4MDQ4MX0.R_a_H8TO26tJm794AbsCJzLN4tdFGyF2dIPrnYfWzzg&t=2024-04-05T19%3A14%3A41.780Z" className="h-20 w-auto mix-blend-multiply" alt="Mentore" /></Link>
            {loading.webLoading ? <Loader /> : <RegisterBlock register={register} setRegister={setRegister} mentorSkills={mentorSkills} setMentorSkills={setMentorSkills} isMentor={isMentor} setIsMentor={setIsMentor} loading={loading} setLoading={setLoading} allSkills={allSkills} />}
        </div>
    )
}
