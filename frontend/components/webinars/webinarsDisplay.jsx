import React from "react";
import WebinarCard from "./webinarCard";

export default function WebinarsDisplay({
  allWebinars,
  loading,
  setLoading,
  user,
}) {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 sm:gap-24 place-content-center">
      {!loading &&
        allWebinars.map((webinar, index) => {
          if (
            new Date().toISOString() < new Date(webinar.end_time).toISOString()
          ) {
            return (
              <WebinarCard
                user={user}
                webinar={webinar}
                key={index}
                setLoading={setLoading}
              />
            );
          }
        })}
    </div>
  );
}
