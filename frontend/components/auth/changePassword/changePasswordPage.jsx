import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "../../global/loader";
import ChangePasswordBlock from "./changePasswordBlock";

export function ChangePassword() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 lg:px-8">
      <Link to="/" className="relative">
        <img
          src="https://uiliugseadtftlskhpcl.supabase.co/storage/v1/object/sign/assets/mentore.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhc3NldHMvbWVudG9yZS5qcGciLCJpYXQiOjE3MzAxODUwOTQsImV4cCI6MTg4Nzg2NTA5NH0.kJcsFJEOAC4hrV88B9d0FnDp1wgpntRboWfe0RIJAOo&t=2024-10-29T06%3A58%3A14.455Z"
          className="h-20 w-auto mix-blend-multiply"
          alt="Mentore"
        />
      </Link>
      {loading ? <Loader /> : <ChangePasswordBlock setLoading={setLoading} />}
    </div>
  );
}
