import React from "react";

export default function EmptyInsightsPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="mt-8 flex flex-col items-center">
        <svg
          className="w-16 h-16 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <p className="mt-4 text-gray-600 text-lg font-medium">
          No insights available!
        </p>
      </div>
    </div>
  );
}
