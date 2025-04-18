const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
        <div className="h-10 bg-gray-200 w-1/3 rounded mb-4"></div>
        <div className="h-6 bg-gray-200 w-3/4 rounded mb-2"></div>
        <div className="h-6 bg-gray-200 w-2/3 rounded mb-8"></div>
        <div className="h-8 bg-gray-200 w-1/4 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
