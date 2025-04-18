export default function ProductsLoading() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <div className="animate-pulse">
        {/* Banner skeleton */}
        <div className="h-24 bg-gray-200 rounded-lg mb-8"></div>

        {/* Categories skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>

        {/* Products grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
