import React, { useEffect, useState } from "react";
import { benefitsData } from "../../src/assets/landingBenefits";

export default function Benefits() {
  return (
    <>
      <div className="mx-auto my-10 flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold md:text-6xl">No need to struggle</p>
        <p className="text-2xl font-bold md:text-6xl">alone anymore</p>
      </div>

      <div className="mx-auto grid w-3/4 grid-cols-1 md:gap-2 lg:grid-cols-2">
        {benefitsData.map((data) => (
          <div
            key={data.id}
            className="border-dark-500 flex flex-col items-center justify-center rounded-lg border-2 border-solid p-10 md:flex-row"
          >
            <div className="flex w-64 flex-col p-1 ">
              <p className="mb-8 text-sm">{data.title}</p>
              <div>
                <p className="mb-3 text-2xl font-medium">{data.description}</p>
                <p className="text-sm">{data.brief}</p>
              </div>
            </div>
            <div className="flex w-1/2 items-center justify-center">
              <img src={data.img} className="rounded-lg" alt="grid image" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
