import React, { useEffect, useState } from "react";
import { stories } from "../../src/assets/stories";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Testimonials() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  return (
    <div className="my-10 flex flex-col items-center justify-center">
      <p className="mb-10 text-2xl font-bold md:text-6xl">Our Testimonials</p>
      <div className="container">
        <Slider {...settings}>
          {stories.map((data) => (
            <div
              key={data.id}
              className="mx-8 max-w-sm min-h-[42rem] shadow-lg hover:shadow-2xl duration-200 rounded-xl overflow-hidden border-2 border-solid"
            >
              <div className="aspect-[3/4]">
                <img
                  src={data.img}
                  className="object-cover w-full h-full"
                  alt="author photo"
                />
              </div>
              <div className="p-4">
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  {data.name}
                </p>
                <hr className="my-2 border-t border-gray-300" />
                <p className="text-sm text-gray-700">{data.review}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
