import { stories } from "../../src/assets/stories";
import "./landing.css";

export default function Testimonials() {
  return (
    <div className="container mx-auto">
      <h2 className="mb-10 text-center text-2xl font-bold md:text-6xl">
        Our Testimonials
      </h2>
      <div className="scroller">
        <div className="scroller_inner">
          {stories.map((data) => (
            <div
              key={data.id}
              className="max-h-lg max-w-96 shadow-lg hover:shadow-2xl duration-200 rounded-xl border-2 border-solid"
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
          {stories.map((data) => (
            <div
              key={`${data.id}-duplicate`}
              className="max-h-lg max-w-96 shadow-lg hover:shadow-2xl duration-200 rounded-xl border-2 border-solid"
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
        </div>
      </div>
    </div>
  );
}
