import React from "react";

const CardSkeleton = ({ width }) => {
  return (
    <div
      className={`p-8 flex flex-col gap-4 rounded-xl border-2 animate-pulse w-[${width}]`}
    >
      <div className="h-6 bg-gray-300 rounded-md w-1/3"></div>
      <div className="h-12 bg-gray-300 rounded-md w-1/2"></div>
      <div className="flex items-center gap-2">
        <div className="h-6 bg-gray-300 rounded-md w-1/4"></div>
        <div className="h-6 bg-gray-200 rounded-md w-2/3"></div>
      </div>
    </div>
  );
};

export default CardSkeleton;
