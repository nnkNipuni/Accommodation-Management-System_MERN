import { useState, useEffect } from "react";
import { FaSearch, FaStar, FaHeart, FaMapMarkerAlt, FaBed, FaBath } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function BoardingFilter() {
  const [price, setPrice] = useState([5000, 80000]);
  const [accommodationType, setAccommodationType] = useState("");
  const [titleQuery, setTitleQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [advertisements, setAdvertisements] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllApprovedAdvertisements = async () => {
      try {
       
        setLoading(true);
        const response = await axios.get("http://localhost:5001/api/advertisements/approved-verified");
        console.log("Fetched ads:", response.data);
        setAdvertisements(response.data);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllApprovedAdvertisements();
  }, []);

  const handleFacilityChange = (facility) => {
    setSelectedFacilities(prev =>
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };


  const filteredAds = advertisements.filter(ad => {
    if (ad.approve !== "Approved") return false;
  
    // Title filter (normalize both sides)
    if (titleQuery.trim() && !(ad.title || "").toLowerCase().includes(titleQuery.trim().toLowerCase())) return false;
    
    // Location filter (normalize both sides)
    if (
      locationQuery.trim().length > 0 &&
      !ad.location?.toLowerCase().includes(locationQuery.trim().toLowerCase())
    ) {
      return false;
    }
  
    // Accommodation type filter
    if (accommodationType && ad.AccommodationType !== accommodationType) return false;
  
    // Price filter
    if (ad.price < price[0] || ad.price > price[1]) return false;
  
    // Facility filter
    if (
      selectedFacilities.length > 0 &&
      (!ad.facilities || !selectedFacilities.every(f => ad.facilities.includes(f)))
    ) {
      return false;
    }
  
    return true;
  });
  
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 pt-12">Find Your Perfect Boarding</h1>
          <p className="text-xl max-w-3xl mx-auto">Browse through our verified listings to find your ideal accommodation</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <FaSearch className="mr-2 text-indigo-600" />
                Search Filters
              </h3>
              
              {/* Title Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search by Title</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Cozy Apartment"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={titleQuery}
                    onChange={(e) => setTitleQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Location Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search by Location</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Colombo"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Accommodation Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setAccommodationType(e.target.value)}
                  value={accommodationType}
                >
                  <option value="">All Types</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Annex">Annex</option>
                  <option value="Boarding">Boarding</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: Rs. {price[0]} - Rs. {price[1]}
                </label>
                <div className="px-2">
                  <Slider
                    range
                    min={5000}
                    max={80000}
                    step={1000}
                    defaultValue={price}
                    value={price}
                    onChange={(value) => setPrice(value)}
                    trackStyle={[{ backgroundColor: '#4f46e5' }]}
                    handleStyle={[
                      { borderColor: '#4f46e5', backgroundColor: 'white' },
                      { borderColor: '#4f46e5', backgroundColor: 'white' }
                    ]}
                    railStyle={{ backgroundColor: '#e5e7eb' }}
                  />
                </div>
              </div>

              {/* Facilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
                <div className="space-y-2">
                  {["Air Conditioning", "Washing Machine", "Hot Water", "Free Wi-Fi"].map((facility) => (
                    <label key={facility} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                        checked={selectedFacilities.includes(facility)}
                        onChange={() => handleFacilityChange(facility)}
                      />
                      <span className="text-sm text-gray-700">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {filteredAds.length} {filteredAds.length === 1 ? 'Property' : 'Properties'} Found
              </h3>
              <div>
                <select className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Sort by: Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            )}

            {/* No Results */}
            {!loading && filteredAds.length === 0 && (
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500">Try adjusting your search filters</p>
              </div>
            )}

            {/* Property Listings */}
            {!loading && filteredAds.length > 0 && (
              <div className="space-y-6">
                {filteredAds.map((ad) => (
                  <Link to={`/advertisement/${ad._id}`} key={ad._id} className="block">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="md:flex">
                        {/* Property Image */}
                        <div className="md:w-1/3 h-48 md:h-auto">
                          {ad.images?.[0] ? (
                            <img
                              src={`http://localhost:5001/${ad.images?.[0]?.startsWith('uploads/') ? ad.images[0] : `uploads/${ad.images?.[0]}`}`}
                              alt={ad.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500">No Image Available</span>
                            </div>
                          )}
                        </div>

                        {/* Property Details */}
                        <div className="p-6 md:w-2/3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{ad.title}</h3>
                              <p className="text-gray-600 mb-2 flex items-center">
                                <FaMapMarkerAlt className="mr-1 text-indigo-600" />
                                {ad.location}
                              </p>
                            </div>
                            <button className="text-gray-400 hover:text-red-500">
                              <FaHeart />
                            </button>
                          </div>

                          <div className="flex items-center mb-4">
                            <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300"} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">(24 reviews)</span>
                          </div>

                          <p className="text-gray-700 mb-4 line-clamp-2">{ad.description || "No description available"}</p>

                          <div className="flex flex-wrap gap-4 mb-4">
                            {ad.facilities?.slice(0, 3).map((facility, index) => (
                              <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">
                                {facility}
                              </span>
                            ))}
                            {ad.facilities?.length > 3 && (
                              <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
                                +{ad.facilities.length - 3} more
                              </span>
                            )}
                          </div>
                            
                         
                            <div>
                              <span className="text-xl font-bold text-indigo-600">Rs. {ad.price.toLocaleString()}</span>
                              <span className="text-gray-500 text-sm"> / month</span>
                            </div>
                          </div>
                        </div>
                      {/* </div> */}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}