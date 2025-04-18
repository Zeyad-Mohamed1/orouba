export default function Loading() {
  return (
    <div className="container mx-auto py-20 px-4 md:px-8">
      <div className="animate-pulse max-w-6xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 w-3/4 rounded"></div>
              <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
              <div className="h-4 bg-gray-200 w-full rounded mt-8"></div>
              <div className="h-4 bg-gray-200 w-full rounded"></div>
              <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
