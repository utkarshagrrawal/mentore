import React from "react";
import WebinarCard from "./webinarCard";

export default function WebinarsDisplay({ allWebinars, loading, setLoading, user }) {
    return (
        <div className="w-full mb-10">
            <div className="flex flex-wrap justify-center items-center mx-16 mt-3">
                <h1 className="text-4xl font-bold text-center">Live webinars</h1>
            </div>
            <div className="flex w-full flex-wrap justify-center items-center mt-8">
                <div className="w-full mx-16 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 place-items-center place-content-center">
                    {!loading && allWebinars.current.map((webinar, index) => {
                        if (new Date().toISOString() < new Date(webinar.end_time).toISOString()) {
                            return <WebinarCard user={user} webinar={webinar} key={index} setLoading={setLoading} />
                        }
                    })
                    }
                </div>
            </div>
        </div>
    )
}