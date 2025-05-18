import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  BanknotesIcon
} from "@heroicons/react/24/outline";

const Pending = () => {
  const navigate = useNavigate();
  const [pendingAds, setPendingAds] = useState([]);
  const [approvedAds, setApprovedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyAdvertisements();
  }, []);

  const fetchMyAdvertisements = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get("http://localhost:5001/api/advertisements");
      const allAds = response.data;

      const pending = allAds.filter(ad => ad.approve === "Pending");
      const approved = allAds.filter(ad => ad.approve === "Approved");

      setPendingAds(pending);
      setApprovedAds(approved);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePayment = (adId) => {
    // Payment handling logic
    alert(`Redirecting to payment for ad ${adId}`);
    navigate(`/payment/${adId}`);
  };

  const handleViewDetails = (adId) => {
    // View details logic
    alert(`Viewing details for ad ${adId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advertisement Status</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your boarding place listings and payments
            </p>
          </div>
          <button
            onClick={fetchMyAdvertisements}
            disabled={refreshing}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowPathIcon className={`-ml-1 mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Column */}
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Pending Approval
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {pendingAds.length}
                    </span>
                  </h3>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {pendingAds.length === 0 ? (
                  <div className="text-center py-8">
                    <XCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pending listings</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      All your listings have been processed or you haven't created any yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingAds.map((ad) => (
                      <div key={ad._id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{ad.title}</h4>
                              <p className="mt-1 text-sm text-gray-500">{ad.location}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{ad.description}</p>
                          
                          <div className="mt-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">LKR {ad.price.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">per month</p>
                            </div>
                            <button
                              onClick={() => handleViewDetails(ad._id)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <EyeIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                              View
                            </button>
                          </div>
                        </div>
                        {ad.images?.[0] && (
                          <img 
                            src={`http://localhost:5001/${ad.images[0]}`} 
                            alt={ad.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Approved Column */}
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Approved Listings
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {approvedAds.length}
                    </span>
                  </h3>
                </div>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {approvedAds.length === 0 ? (
                  <div className="text-center py-8">
                    <XCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No approved listings</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new listing or check back later for approvals.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedAds.map((ad) => (
                      <div key={ad._id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{ad.title}</h4>
                              <p className="mt-1 text-sm text-gray-500">{ad.location}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Approved
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{ad.description}</p>
                          
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-2 mb-3">
                              {ad.facilities.slice(0, 3).map((facility, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  {facility}
                                </span>
                              ))}
                              {ad.facilities.length > 3 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  +{ad.facilities.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">LKR {ad.price.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">per month</p>
                            </div>
                            <button
                              onClick={() => handlePayment(ad._id)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <BanknotesIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                              Make Payment
                            </button>
                          </div>
                        </div>
                        {ad.images?.[0] && (
                          <img 
                            src={`http://localhost:5001/${ad.images[0]}`} 
                            alt={ad.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pending;