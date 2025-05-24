import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
// import AdminOwnerNavbar from "../../../components/AdminOwnerNavbar";
import { 
  XCircleIcon, 
  ArrowPathIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

const RejectedListings = () => {
  const [rejectedAds, setRejectedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRejectedAdvertisements();
  }, []);

  const fetchRejectedAdvertisements = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get("http://localhost:5001/api/advertisements");
      const rejected = response.data.filter(ad => ad.approve === "Rejected");
      setRejectedAds(rejected);
    } catch (error) {
      console.error("Error fetching rejected advertisements:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEdit = (adId) => {
    // Edit functionality
    alert(`Editing advertisement ${adId}`);
  };

  const handleDelete = async (adId) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      try {
        await axios.delete(`http://localhost:5001/api/advertisements/${adId}`);
        fetchRejectedAdvertisements(); // Refresh the list
      } catch (error) {
        console.error("Error deleting advertisement:", error);
      }
    }
  };

  const handleResubmit = async (adId) => {
    if (!window.confirm("Are you sure you want to resubmit this advertisement for approval?")) return;
  
    try {
      await axios.put(`http://localhost:5001/api/advertisements/approve/${adId}`, {
        approve: "Pending",
        rejectionReason: ""
      });
  
      alert("Advertisement resubmitted for admin approval!");
      fetchRejectedAdvertisements(); // Refresh the list after resubmission
    } catch (error) {
      console.error("Error resubmitting advertisement:", error);
      alert("Failed to resubmit. Please try again.");
    }
  };
  
  return (
    <>

      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <XCircleIcon className="h-6 w-6 text-red-500 mr-2" />
                Rejected Listings
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Review and manage your rejected boarding place listings
              </p>
            </div>
            <button
              onClick={fetchRejectedAdvertisements}
              disabled={refreshing}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowPathIcon className={`-ml-1 mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh List'}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : rejectedAds.length === 0 ? (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-12 text-center">
                <XCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No rejected listings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  All your listings have been approved or are still under review.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rejectedAds.map((ad) => (
                <div key={ad._id} className="bg-white shadow rounded-lg border border-gray-200 flex flex-col h-full">
                {/* Image */}
                {ad.images?.[0] && (
                  <div className="h-40 w-full">
                    <img
                      src={`http://localhost:5001/${ad.images[0]}`}
                      alt={ad.title}
                      className="h-full w-full object-cover rounded-t-lg"
                    />
                  </div>
                )}
              
                {/* Content */}
                <div className="flex flex-col justify-between flex-grow p-4">
                  {/* Title & Type */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h2 className="text-lg font-bold text-gray-900 truncate">{ad.title}</h2>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">{ad.AccommodationType}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{ad.location}</p>
                  </div>
              
                  {/* Description */}
                  <p className="text-sm text-gray-700 my-2 line-clamp-2">{ad.description}</p>
              
                  {/* Facilities */}
                  <div className="flex flex-wrap gap-1 overflow-y-auto max-h-12 mb-2">
                    {ad.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
              
                  {/* Price */}
                  <p className="text-sm font-semibold text-gray-900 mb-2">LKR {ad.price.toLocaleString()}</p>
              
                  {/* Rejection Reason */}
                  {ad.rejectionReason && (
                    <div className="bg-red-50 p-2 rounded mb-3">
                      <div className="flex items-start gap-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-red-800">Reason</p>
                          <p className="text-xs text-red-700 italic">{ad.rejectionReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
              
                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-2 mt-auto">
                    {/* <button
                      onClick={() => handleEdit(ad._id)}
                      className="text-sm text-gray-700 bg-white border border-gray-300 rounded px-3 py-2 hover:bg-gray-100"
                    >
                      <PencilSquareIcon className="inline h-4 w-4 mr-1" />
                      Edit
                    </button> */}
                    <button
                    className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                     >
                    <Link to={`/edit-ad/${ad._id}`}>
                      <PencilSquareIcon className="-ml-0.5 mr-1.5 h-4 w-4 inline" />
                      Edit
                    </Link>
                  </button>
                    <button
                      onClick={() => handleResubmit(ad._id)}
                      className="text-sm text-white bg-indigo-600 rounded px-3 py-2 hover:bg-indigo-700"
                    >
                      Resubmit
                    </button>
                    <button
                      onClick={() => handleDelete(ad._id)}
                      className="text-sm text-white bg-red-600 rounded px-3 py-2 hover:bg-red-700"
                    >
                      <TrashIcon className="inline h-4 w-4 mr-1" />
                    </button>
                  </div>
                </div>
              </div>
         
          
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RejectedListings;