import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BoardingFilter() {
  const [price, setPrice] = useState([5000, 80000]);
  const [accommodationType, setAccommodationType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [advertisements, setAdvertisements] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);

  // Fetch all approved advertisements on initial load
  useEffect(() => {
    const fetchAllApprovedAdvertisements = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/advertisements/");
        const approvedAds = response.data.filter((ad) => ad.approve === "Approved");
        setAdvertisements(approvedAds);
      } catch (error) {
        console.error("Error fetching advertisements:", error);
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

  // Calculate filtered ads based on all criteria
  const filteredAds = advertisements.filter(ad => {
    // Base approved check
    if (ad.approve !== "Approved") return false;

    // Accommodation type filter
    if (accommodationType && ad.type !== accommodationType) return false;

    // Price range filter
    if (ad.price < price[0] || ad.price > price[1]) return false;

    // Search query filter
    const query = searchQuery.toLowerCase();
    if (query && 
      !ad.title.toLowerCase().includes(query) && 
      !ad.description.toLowerCase().includes(query)
    ) {
      return false;
    }

    // Facilities filter
    if (selectedFacilities.length > 0 && (
      !ad.facilities || 
      !selectedFacilities.every(f => ad.facilities.includes(f))
    )) {
      return false;
    }

    return true;
  });

  return (
    <div className="flex gap-20 p-10 mt-20">
      {/* Filter Section */}
      <div className="w-1/4 space-y-4 border-r pr-4">
        <div>
          <label className="font-semibold">Accommodation Type</label>
          <select
            className="w-full border p-2 rounded-md"
            onChange={(e) => setAccommodationType(e.target.value)}
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
            <option>Date: Newest on top</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Price</label>
          <input
            type="range"
            min="5000"
            max="80000"
            value={price[0]}
            onChange={(e) => setPrice([parseInt(e.target.value), price[1]])}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>Rs.{price[0]}</span>
            <span>Rs.{price[1]}</span>
          </div>
        </div>

        <div>
          <label className="font-semibold">Facilities</label>
          <div className="space-y-2">
            {["Air Conditioning", "Washing Machine", "Hot Water", "Free Wi-Fi"].map((facility) => (
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
          />
          <FaSearch className="text-gray-500" />
        </div>

        {/* Boarding Listings */}
        <div className="space-y-4">
          {filteredAds.length > 0 ? (
            filteredAds.map((ad) => (
              <Link to={`/advertisement/${ad._id}`} key={ad._id} className="block">
                <div className="flex items-center gap-4 border p-4 rounded-md hover:bg-gray-100 transition">
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md">
  {ad.images?.[0] ? (
    <img 
      src={`http://localhost:5001/${ad.images[0]}`} 
      alt={ad.title} 
      className="w-full h-full object-cover rounded-md" 
    />
  ) : (
    <span className="text-gray-500">No Image</span>
  )}
</div>
                  <div className="border-l pl-4 flex-1">
                    <p className="font-semibold">{ad.title}</p>
                    <p className="text-sm text-gray-500">{ad.description}</p>
                    <p className="text-sm font-medium">Rs. {ad.price}</p>
                    {ad.facilities?.length > 0 && (
                      <p className="text-xs text-gray-500">Facilities: {ad.facilities.join(", ")}</p>
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