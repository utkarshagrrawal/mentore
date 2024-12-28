import { benefitsData } from "../../src/assets/landingBenefits";

export default function Benefits() {
  return (
    <div className="container mx-auto my-10">
      <p className="text-2xl text-center font-bold md:text-6xl">
        No need to struggle
      </p>
      <p className="text-2xl text-center font-bold md:text-6xl">
        alone anymore
      </p>

      <div className="grid grid-cols-1 md:gap-2 lg:grid-cols-2 mt-10">
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
    </div>
  );
}
