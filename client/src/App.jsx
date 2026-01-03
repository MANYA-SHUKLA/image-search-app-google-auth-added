import { useState, useEffect } from 'react';
import api from './config/api';
import Login from './components/Login';
import TopSearches from './components/TopSearches';
import SearchBar from './components/SearchBar';
import ImageGrid from './components/ImageGrid';
import SearchHistory from './components/SearchHistory';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [topSearches, setTopSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    checkAuth();
    fetchTopSearches();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSearches = async () => {
    try {
      const response = await api.get('/api/top-searches');
      setTopSearches(response.data);
    } catch (error) {
      console.error('Failed to fetch top searches:', error);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const response = await api.get('/api/history');
      setSearchHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch search history:', error);
    }
  };

  const handleSearch = async (term) => {
    try {
      const response = await api.post('/api/search', { term });
      setSearchResults(response.data);
      setSelectedImages(new Set());
      fetchTopSearches();
      fetchSearchHistory();
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout', {});
      setUser(null);
      setSearchResults(null);
      setSelectedImages(new Set());
      setSearchHistory([]);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleImageSelection = (imageId) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={checkAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Image Search
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-white shadow-md"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Top Searches Banner */}
      {topSearches.length > 0 && <TopSearches searches={topSearches} onSearch={handleSearch} />}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Search History */}
          <div className="lg:col-span-1">
            <SearchHistory history={searchHistory} onSearch={handleSearch} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <SearchBar onSearch={handleSearch} />

            {searchResults && (
              <>
                <div className="mt-6 mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <p className="text-gray-700">
                      You searched for <span className="font-bold text-blue-600">"{searchResults.term}"</span>
                      <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {searchResults.count} {searchResults.count === 1 ? 'result' : 'results'}
                      </span>
                    </p>
                    {selectedImages.size > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-semibold">
                          {selectedImages.size} selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <ImageGrid
                  images={searchResults.images}
                  selectedImages={selectedImages}
                  onToggleSelection={toggleImageSelection}
                />
              </>
            )}

            {!searchResults && (
              <div className="mt-16 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Start exploring images!</h3>
                <p className="text-gray-500 text-lg">
                  Use the search bar above or click on a top search term to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

