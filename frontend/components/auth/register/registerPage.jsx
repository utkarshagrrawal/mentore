import { React, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../global/loader";
import { RegisterBlock } from "./registerBlock";

export function Register() {
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    registerFor: "",
    profession: "",
    company: "",
    experience: 0,
  });
  const [mentorSkills, setMentorSkills] = useState([]);
  const [loading, setLoading] = useState({
    webLoading: false,
    skillsLoading: true,
  });
  const [isMentor, setIsMentor] = useState(false);
  const allSkills = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      let user = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/user/details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      let result = await user.json();
      if (result.error) {
        localStorage.removeItem("token");
        return;
      } else {
        navigate("/");
      }
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8">
      <Link to="/" className="relative">
        <img
          src="https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/mentore.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWVudG9yZS5qcGciLCJpYXQiOjE3MzAxODUwOTQsImV4cCI6MTg4Nzg2NTA5NH0.kJcsFJEOAC4hrV88B9d0FnDp1wgpntRboWfe0RIJAOo&t=2024-10-29T06%3A58%3A14.455Z"
          className="h-20 w-auto mix-blend-multiply"
          alt="Mentore"
        />
      </Link>
      {loading.webLoading ? (
        <Loader />
      ) : (
        <RegisterBlock
          register={register}
          setRegister={setRegister}
          mentorSkills={mentorSkills}
          setMentorSkills={setMentorSkills}
          isMentor={isMentor}
          setIsMentor={setIsMentor}
          loading={loading}
          setLoading={setLoading}
          allSkills={allSkills}
        />
      )}
    </div>
  );
}
