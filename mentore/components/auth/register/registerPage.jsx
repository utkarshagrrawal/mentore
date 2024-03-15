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
            {loading.webLoading ? <Loader /> : <RegisterBlock register={register} setRegister={setRegister} mentorSkills={mentorSkills} setMentorSkills={setMentorSkills} isMentor={isMentor} setIsMentor={setIsMentor} loading={loading} setLoading={setLoading} allSkills={allSkills} />}
        </div>
    )
}
