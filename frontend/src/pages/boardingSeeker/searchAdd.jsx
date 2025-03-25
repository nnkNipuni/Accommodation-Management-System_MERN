import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";


export default function BoardingFilter() {
  const [price, setPrice] = useState([5000, 80000]);
  const [accommodationType, setAccommodationType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [advertisements, setAdvertisements] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  // Fetch all advertisements on initial load
  useEffect(() => {
    fetchAllAdvertisements();
  }, []);

  const fetchAllAdvertisements = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/advertisements');
      setAdvertisements(response.data);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
    }
  };

  const handleAccommodationTypeChange = async (e) => {
    const type = e.target.value;
    setAccommodationType(type);
    
    try {
      if (type) {
        const response = await axios.get(`http://localhost:5001/api/advertisements/type/${type}`);
        setAdvertisements(response.data);
      } else {
        // If "All" is selected, fetch all advertisements
        fetchAllAdvertisements();
      }
    } catch (error) {
      console.error("Error filtering by accommodation type:", error);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim()) {
        const response = await axios.get(`http://localhost:5001/api/advertisements/search?query=${searchQuery}`);
        setAdvertisements(response.data);
      } else {
        fetchAllAdvertisements();
      }
    } catch (error) {
      console.error("Error searching advertisements:", error);
    }
  };

  const handleFacilityChange = (facility) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter(f => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  // Client-side price filtering (you would ideally want to do this server-side)
  const applyPriceFilter = () => {
    fetchAllAdvertisements().then(() => {
      setAdvertisements(prev => 
        prev.filter(ad => ad.price >= price[0] && ad.price <= price[1])
      );
    });
  };

  // Modified rendering to display more advertisement details
  return (
    <div className="flex gap-20 p-10 mt-20">
      {/* Filter Section */}
      <div className="w-1/4 space-y-4 border-r pr-4">
        <div>
          <label className="font-semibold">Location</label>
          <select className="w-full border p-2 rounded-md">
            <option>All</option>
          </select>
        </div>
        
        <div>
          <label className="font-semibold">Accommodation Type</label>
          <select
            className="w-full border p-2 rounded-md"
            onChange={handleAccommodationTypeChange} 
            value={accommodationType} 
          >
            <option value="">All</option> 
            <option value="Hostel">Hostel</option>
            <option value="Annex">Annex</option>
            <option value="Boarding">Boarding</option>
          </select>
        </div>
        
        <div>
          <label className="font-semibold">Sort By</label>
          <select className="w-full border p-2 rounded-md">
            <option>Date : Newest on top</option>
          </select>
        </div>
        
        <div>
          <label className="font-semibold">Price</label>
          <input
            type="range"
            min="5000"
            max="70000"
            value={price[0]}
            onChange={(e) => setPrice([e.target.value, price[1]])}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>Rs.{price[0]}</span>
            <span>Rs.{price[1]}</span>
          </div>
          <button 
            onClick={applyPriceFilter}
            className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
          >
            Apply
          </button>
        </div>
        
        <div>
          <label className="font-semibold">No of Rooms</label>
          <select className="w-full border p-2 rounded-md">
            <option>Any</option>
          </select>
        </div>
        
        <div>
          <label className="font-semibold">Facilities</label>
          <div className="space-y-2">
            {['Air Conditioning', 'Washing Machine', 'Hot Water', 'FreeWi-Fi'].map((facility) => (
              <label key={facility} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={selectedFacilities.includes(facility)}
                  onChange={() => handleFacilityChange(facility)}
                />
                {facility}
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results Section */}
      <div className="w-3/4 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center border p-2 rounded-md w-1/2">
          <input
            type="text"
            placeholder="Search..."
            className="w-full outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <FaSearch 
            className="text-gray-500 cursor-pointer"
            onClick={handleSearch}
          />
        </div>
        
        {/* Boarding Listings */}
        <div className="space-y-4">
          {advertisements.length > 0 ? (
            advertisements.map((ad) => (
              <Link to={`/advertisement/${ad._id}`} key={ad._id} className="block">
              <div className="flex items-center gap-4 border p-4 rounded-md hover:bg-gray-100 transition">
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md">
                  {ad.image && ad.image.length > 0 ? (
                    <img src={ad.image[0]} alt={ad.Adtitle} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </div>
                <div className="border-l pl-4 flex-1">
                  <p className="font-semibold">{ad.Adtitle}</p>
                  <p className="text-sm text-gray-500">{ad.description}</p>
                  <p className="text-sm font-medium">Rs. {ad.price}</p>
                  {ad.facilities && ad.facilities.length > 0 && (
                    <p className="text-xs text-gray-500">Facilities: {ad.facilities.join(', ')}</p>
                  )}
                </div>
              </div>
            </Link>
            ))
          ) : (
            <p>No advertisements found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

