

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import AdminOwnerNavbar from "../../../components/AdminOwnerNavbar";

// const PendingApproval = () => {
//   const [pendingAds, setPendingAds] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Rejection modal states
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [adToReject, setAdToReject] = useState(null);

//   useEffect(() => {
//     fetchPendingAdvertisements();
//   }, []);

//   const fetchPendingAdvertisements = async () => {
//     try {
//       const response = await axios.get("http://localhost:5001/api/advertisements");
//       const pending = response.data.filter(ad => ad.approve === "Pending");
//       setPendingAds(pending);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching pending advertisements:", error);
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (adId) => {
//     try {
//       await axios.put(`http://localhost:5001/api/advertisements/approve/${adId}`, { approve: "Approved" });
//       setPendingAds(prevAds => prevAds.filter(ad => ad._id !== adId));
//       alert("Advertisement approved successfully!");
//     } catch (error) {
//       console.error("Error approving advertisement:", error);
//       alert("Failed to approve advertisement.");
//     }
//   };

//   const openRejectModal = (ad) => {
//     setAdToReject(ad);
//     setRejectionReason("");
//     setShowRejectModal(true);
//   };

//   const submitRejection = async () => {
//     if (!rejectionReason.trim()) {
//       alert("Please enter a reason for rejection.");
//       return;
//     }

//     try {
//       await axios.put(`http://localhost:5001/api/advertisements/reject/${adToReject._id}`, {
//         approve: "Rejected",
//         rejectionReason: rejectionReason.trim(),
//       });
//       setPendingAds(prevAds => prevAds.filter(ad => ad._id !== adToReject._id));
//       setShowRejectModal(false);
//       alert("Advertisement rejected with reason.");
//     } catch (error) {
//       console.error("Error rejecting advertisement:", error);
//       alert("Failed to reject advertisement.");
//     }
//   };

//   return (
//     <>
//       <AdminOwnerNavbar role="admin" />
//       <div className="p-4 pt-16">
//         <h1 className="text-xl font-semibold mb-4">Pending Approvals</h1>

//         {loading ? (
//           <p>Loading pending advertisements...</p>
//         ) : pendingAds.length === 0 ? (
//           <p>No pending approvals.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {pendingAds.map((ad) => (
//               <div key={ad._id} className="border rounded-lg p-4 shadow-md">
//                 <h2 className="text-lg font-bold mb-1">{ad.title}</h2>
//                 <p><strong>Description:</strong> {ad.description}</p>
//                 <p><strong>Price:</strong> LKR {ad.price}</p>
//                 <p><strong>Location:</strong> {ad.location}</p>
//                 <p><strong>Type:</strong> {ad.AccommodationType}</p>
//                 <p><strong>Facilities:</strong> {ad.facilities.join(", ")}</p>

//                 <div className="mt-2 grid grid-cols-2 gap-2">
//                   {ad.images && ad.images.map((img, i) => (
//                     <img
//                       key={i}
//                       src={`http://localhost:5001/${img}`}
//                       alt={`${ad.title} ${i + 1}`}
//                       className="w-full h-32 object-cover rounded"
//                     />
//                   ))}
//                 </div>

//                 <div className="flex space-x-2 mt-4">
//                   <button
//                     onClick={() => handleApprove(ad._id)}
//                     className="border border-green-800 text-green-800 bg-white p-2 rounded w-full hover:bg-green-100 transition"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => openRejectModal(ad)}
//                     className="border border-[#800000] text-[#800000] bg-white p-2 rounded w-full hover:bg-red-100 transition"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Rejection Modal */}
//         {showRejectModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
//               <h2 className="text-xl font-bold mb-4">Reject Advertisement</h2>
//               <p className="mb-2">Why are you rejecting <strong>{adToReject?.title}</strong>?</p>
//               <textarea
//                 rows={4}
//                 placeholder="Enter reason..."
//                 className="w-full border p-2 rounded mb-4"
//                 value={rejectionReason}
//                 onChange={(e) => setRejectionReason(e.target.value)}
//               />
//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={() => setShowRejectModal(false)}
//                   className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={submitRejection}
//                   className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-100"
//                 >
//                   Submit Rejection
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default PendingApproval;


import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminOwnerNavbar from "../../../components/AdminOwnerNavbar";

const PendingApproval = () => {
  const [pendingAds, setPendingAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [adToReject, setAdToReject] = useState(null);

  useEffect(() => {
    fetchPendingAdvertisements();
  }, []);

  const fetchPendingAdvertisements = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/advertisements");
      const pending = response.data.filter(ad => ad.approve === "Pending");
      setPendingAds(pending);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending advertisements:", error);
      setLoading(false);
    }
  };

  const handleApprove = async (adId) => {
    try {
      await axios.put(`http://localhost:5001/api/advertisements/approve/${adId}`, { approve: "Approved" });
      setPendingAds(prev => prev.filter(ad => ad._id !== adId));
      alert("Advertisement approved successfully!");
    } catch (error) {
      console.error("Error approving advertisement:", error);
      alert("Failed to approve advertisement.");
    }
  };

  const openRejectModal = (ad) => {
    setAdToReject(ad);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      alert("Please enter a reason for rejection.");
      return;
    }
    try {
      await axios.put(`http://localhost:5001/api/advertisements/reject/${adToReject._id}`, {
        approve: "Rejected",
        rejectionReason: rejectionReason.trim(),
      });
      setPendingAds(prev => prev.filter(ad => ad._id !== adToReject._id));
      setShowRejectModal(false);
      alert("Advertisement rejected.");
    } catch (error) {
      console.error("Error rejecting advertisement:", error);
      alert("Failed to reject advertisement.");
    }
  };

  return (
    <>
      <AdminOwnerNavbar role="admin" />
      <div className="p-6 pt-20">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Pending Approvals</h1>

        {loading ? (
          <p>Loading pending advertisements...</p>
        ) : pendingAds.length === 0 ? (
          <p>No pending approvals.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingAds.map((ad) => (
              <div
                key={ad._id}
                className="border rounded-xl shadow-md p-5 bg-white flex flex-col justify-between min-h-[530px]"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">{ad.title}</h2>
                  <p className="mb-2 text-sm text-gray-700"><span className="font-semibold">Description:</span> {ad.description}</p>
                  <p className="mb-2 text-sm text-gray-700"><span className="font-semibold">Price:</span> LKR {ad.price}</p>
                  <p className="mb-2 text-sm text-gray-700"><span className="font-semibold">Location:</span> {ad.location}</p>
                  <p className="mb-2 text-sm text-gray-700"><span className="font-semibold">Type:</span> {ad.AccommodationType}</p>
                  <p className="mb-4 text-sm text-gray-700"><span className="font-semibold">Facilities:</span> {ad.facilities.join(", ")}</p>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {ad.images && ad.images.map((img, i) => (
                      <img
                        key={i}
                        src={`http://localhost:5001/${img}`}
                        alt={`${ad.title} ${i + 1}`}
                        className="w-full h-28 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => handleApprove(ad._id)}
                    className="w-full py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openRejectModal(ad)}
                    className="w-full py-2 border border-[#800000] text-[#800000] rounded hover:bg-red-50 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
              <h2 className="text-xl font-bold mb-4">Reject Advertisement</h2>
              <p className="mb-2 text-gray-700">
                Why are you rejecting <span className="font-semibold">{adToReject?.title}</span>?
              </p>
              <textarea
                rows={4}
                placeholder="Enter reason..."
                className="w-full border p-2 rounded mb-4"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRejection}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-100"
                >
                  Submit Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PendingApproval;
