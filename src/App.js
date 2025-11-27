import React, { useState, useEffect } from 'react';
import { Rocket, Calendar, Image, Globe, Loader2, ExternalLink } from 'lucide-react';

const NASA_API_KEY = process.env.REACT_APP_NASA_API_KEY || 'DEMO_KEY'; // Using demo key - users should get their own at api.nasa.gov
export default function NASADashboard() {
  const [apod, setApod] = useState(null);
  const [nasaImages, setNasaImages] = useState([]);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [imagesPerPage, setImagesPerPage] = useState(6);
  const [neoData, setNeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('apod');

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchAPOD(),
      fetchNASAImages(),
      fetchNEO()
    ]);
    setLoading(false);
  };

  const fetchAPOD = async () => {
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
      );
      const data = await response.json();
      setApod(data);
    } catch (error) {
      console.error('Error fetching APOD:', error);
    }
  };

  const fetchNASAImages = async (searchTerm = 'space') => {
    try {
      setSearchLoading(true);
      // Search for images - this endpoint doesn't require API key
      const response = await fetch(
        `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchTerm)}&media_type=image`
      );
      const data = await response.json();
      
      // Get images with valid thumbnails
      const images = data.collection.items
        .filter(item => item.links && item.links[0] && item.links[0].href)
        .slice(0, 50) // Fetch 50 images total
        .map(item => ({
          title: item.data[0].title,
          description: item.data[0].description,
          date: item.data[0].date_created,
          url: item.links[0].href,
          center: item.data[0].center || 'NASA'
        }));
      
      setNasaImages(images);
      setDisplayedImages(images.slice(0, 6)); // Show first 6
      setImagesPerPage(6);
      setSearchLoading(false);
    } catch (error) {
      console.error('Error fetching NASA images:', error);
      setNasaImages([]);
      setDisplayedImages([]);
      setSearchLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (imageSearchQuery.trim()) {
      fetchNASAImages(imageSearchQuery);
    }
  };

  const loadMoreImages = () => {
    const newCount = imagesPerPage + 6;
    setDisplayedImages(nasaImages.slice(0, newCount));
    setImagesPerPage(newCount);
  };

  const fetchNEO = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
      );
      const data = await response.json();
      setNeoData(data);
    } catch (error) {
      console.error('Error fetching NEO data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-900 text-xl font-semibold">Loading NASA Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Animated space background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-1 h-1 bg-blue-300 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-pink-300 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10 px-8 py-16">
        {/* Header */}
        <header className="mb-24 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Rocket className="w-16 h-16 text-indigo-600" />
            <h1 className="text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              NASA Dashboard
            </h1>
          </div>
          <p className="text-gray-600 text-2xl font-light">Exploring the cosmos through NASA's open APIs</p>
          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-6 mb-20">
          <button
            onClick={() => setActiveTab('apod')}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all shadow-lg ${
              activeTab === 'apod'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white scale-105'
                : 'bg-white text-gray-700 hover:shadow-xl border-2 border-gray-200'
            }`}
          >
            <Image className="w-6 h-6" />
            <span className="font-semibold">Picture of the Day</span>
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all shadow-lg ${
              activeTab === 'images'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white scale-105'
                : 'bg-white text-gray-700 hover:shadow-xl border-2 border-gray-200'
            }`}
          >
            <Globe className="w-6 h-6" />
            <span className="font-semibold">NASA Gallery</span>
          </button>
          <button
            onClick={() => setActiveTab('neo')}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all shadow-lg ${
              activeTab === 'neo'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white scale-105'
                : 'bg-white text-gray-700 hover:shadow-xl border-2 border-gray-200'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="font-semibold">Near Earth Objects</span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-32 pb-24">
          {/* APOD Section */}
          {activeTab === 'apod' && apod && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-12 shadow-2xl border border-indigo-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-indigo-900">Astronomy Picture of the Day</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                  {apod.media_type === 'image' ? (
                    <img
                      src={apod.url}
                      alt={apod.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <iframe
                      src={apod.url}
                      className="w-full h-96 rounded-2xl"
                      title={apod.title}
                    />
                  )}
                  <div className="absolute inset-0 ring-4 ring-indigo-400/0 group-hover:ring-indigo-400/50 transition-all duration-500 rounded-2xl"></div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-indigo-900">{apod.title}</h3>
                  <p className="text-gray-600 flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    {apod.date}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">{apod.explanation}</p>
                  {apod.copyright && (
                    <p className="text-sm text-gray-500 italic">© {apod.copyright}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* NASA Image Gallery Section */}
          {activeTab === 'images' && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12 shadow-2xl border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-purple-900">NASA Image Gallery</h2>
              </div>
              <p className="text-gray-600 mb-8 text-xl">Stunning images from NASA's missions and archives</p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-12">
                <div className="flex gap-4 max-w-2xl">
                  <input
                    type="text"
                    value={imageSearchQuery}
                    onChange={(e) => setImageSearchQuery(e.target.value)}
                    placeholder="Search NASA images (e.g., mars, hubble, astronaut, galaxy)..."
                    className="flex-1 px-6 py-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-gray-900 text-lg"
                  />
                  <button
                    type="submit"
                    disabled={searchLoading}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {searchLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      'Search'
                    )}
                  </button>
                </div>
              </form>

              {searchLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Searching NASA archives...</p>
                </div>
              ) : displayedImages.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedImages.map((image, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                      >
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400?text=Image+Loading';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                          <div>
                            <p className="text-white font-bold text-lg line-clamp-2">{image.title}</p>
                            <p className="text-gray-200 text-sm mt-1">{image.center}</p>
                            <p className="text-gray-300 text-xs mt-1">{new Date(image.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  {displayedImages.length < nasaImages.length && (
                    <div className="text-center mt-12">
                      <button
                        onClick={loadMoreImages}
                        className="px-10 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-500 transition-all shadow-lg hover:shadow-xl"
                      >
                        Load More Images ({displayedImages.length} of {nasaImages.length})
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No images found. Try a different search term!</p>
                </div>
              )}
            </div>
          )}

          {/* Near Earth Objects Section */}
          {activeTab === 'neo' && neoData && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-12 shadow-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-blue-900">Near Earth Objects Today</h2>
              </div>
              <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
                  <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Objects</p>
                  <p className="text-5xl font-bold text-blue-600">{neoData.element_count}</p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-red-200">
                  <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Potentially Hazardous</p>
                  <p className="text-5xl font-bold text-red-600">
                    {Object.values(neoData.near_earth_objects).flat().filter(neo => neo.is_potentially_hazardous_asteroid).length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
                  <p className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Date Range</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                {Object.values(neoData.near_earth_objects).flat().slice(0, 10).map((neo) => (
                  <div
                    key={neo.id}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-300"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-bold text-blue-900">{neo.name}</h3>
                      {neo.is_potentially_hazardous_asteroid && (
                        <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-bold border-2 border-red-300">
                          ⚠ Hazardous
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-500 font-semibold mb-1">Diameter (m)</p>
                        <p className="text-gray-900 font-bold text-lg">
                          {Math.round(neo.estimated_diameter.meters.estimated_diameter_min)} - {Math.round(neo.estimated_diameter.meters.estimated_diameter_max)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-semibold mb-1">Velocity (km/h)</p>
                        <p className="text-gray-900 font-bold text-lg">
                          {Math.round(parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour)).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-semibold mb-1">Miss Distance (km)</p>
                        <p className="text-gray-900 font-bold text-lg">
                          {Math.round(parseFloat(neo.close_approach_data[0].miss_distance.kilometers)).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-semibold mb-1">Approach Date</p>
                        <p className="text-gray-900 font-bold text-lg">
                          {neo.close_approach_data[0].close_approach_date}
                        </p>
                      </div>
                    </div>
                    <a
                      href={neo.nasa_jpl_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      View Details <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-32 text-center pb-16">
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent mb-8"></div>
          <p className="text-gray-500 text-lg">Data provided by NASA Open APIs</p>
          <p className="text-gray-400 text-sm mt-2">Using DEMO_KEY (get your own at api.nasa.gov)</p>
        </footer>
      </div>
    </div>
  );
}
