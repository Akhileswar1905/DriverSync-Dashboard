const SkeletonLoader = ({ count }) => {
  return (
    <div className="animate-pulse flex gap-4 items-center ">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-4 bg-gray-300 rounded w-1/4"></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
