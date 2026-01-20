function TopSearches({ searches, onSearch }) {
  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold text-sm uppercase tracking-wide">Trending:</span>
          </div>
          {searches.map((search, index) => (
            <button
              key={index}
              onClick={() => onSearch(search.term)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-lg border border-white/30"
            >
              {search.term}
              <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs font-bold">
                {search.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopSearches;

