import React, { useEffect, useState } from "react";
import axios from "axios";

const PendingApproval = () => {
    const [pendingAds, setPendingAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingAdvertisements();
    }, []);

    const fetchPendingAdvertisements = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/advertisements");
            const pendingAds = response.data.filter(ad => ad.approve === "Pending");
            setPendingAds(pendingAds);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching pending advertisements:", error);
            setLoading(false);
        }
    };

    const handleApprove = async (adId) => {
        try {
            await axios.put(`http://localhost:5001/api/advertisements/approve/${adId}`, { approve: "Approved" });

            // Update the UI by removing the approved advertisement
            setPendingAds(prevAds => prevAds.filter(ad => ad._id !== adId));

            alert("Advertisement approved successfully!");
        } catch (error) {
            console.error("Error approving advertisement:", error);
            alert("Failed to approve advertisement.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Pending Approvals</h1>

            {loading ? (
                <p>Loading pending advertisements...</p>
            ) : pendingAds.length === 0 ? (
                <p>No pending approvals.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingAds.map((ad) => (
                        <div key={ad._id} className="border rounded-lg p-4 shadow-md">
                            <h2 className="text-lg font-bold">{ad.title}</h2>
                            <p className="text-gray-600">{ad.description}</p>
                            <p className="text-gray-800 font-semibold">Price: LKR {ad.price}</p>
                            <p className="text-gray-600">Facilities: {ad.facilities.join(", ")}</p>
                            <p className="text-gray-600">Type: {ad.AccommodationType}</p>
                            <div className="mt-2">
                                {ad.images.length > 0 && (
                                    <img
                                        src={`http://localhost:5001/${ad.images[0]}`} 
                                        alt={ad.title}
                                        className="w-full h-40 object-cover rounded"
                                    />
                                )}
                            </div>
                            <button
                                onClick={() => handleApprove(ad._id)}
                                className="mt-4 bg-green-500 text-white p-2 rounded w-full hover:bg-green-600"
                            >
                                Approve
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PendingApproval;
