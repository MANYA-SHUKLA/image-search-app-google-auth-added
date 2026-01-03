function ImageGrid({ images, selectedImages, onToggleSelection }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {images.map((image) => {
        const isSelected = selectedImages.has(image.id);
        return (
          <div
            key={image.id}
            className="relative group cursor-pointer transform transition-all hover:scale-105"
            onClick={() => onToggleSelection(image.id)}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg hover:shadow-2xl transition-all border-2 border-transparent group-hover:border-blue-300">
              <img
                src={image.thumb}
                alt={image.description}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
              
              {/* Selection Indicator */}
              <div className="absolute top-3 right-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-all transform ${
                    isSelected
                      ? 'bg-blue-600 scale-100 ring-4 ring-blue-200'
                      : 'bg-white/90 scale-90 group-hover:scale-100'
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {!isSelected && (
                    <div className="w-4 h-4 rounded border-2 border-gray-400"></div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Image Info Card */}
            <div className="mt-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
              <p className="text-sm font-medium text-gray-800 truncate mb-1" title={image.description}>
                {image.description || 'No description'}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                by{' '}
                <a
                  href={image.authorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {image.author}
                </a>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ImageGrid;

