import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBordings = () => {
    const [approvedAds, setApprovedAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editAd, setEditAd] = useState(null); // Store ad for editing
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        facilities: "",
        accommodationType: ""
    });

    useEffect(() => {
        fetchApprovedAdvertisements();
    }, []);

    const fetchApprovedAdvertisements = async () => {
        try {
            const response = await axios.get("http://localhost:5001/api/advertisements");
            const approvedAds = response.data.filter(ad => ad.approve === "Approved");
            setApprovedAds(approvedAds);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching approved advertisements:", error);
            setLoading(false);
        }
    };

    // 🗑️ DELETE Advertisement
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this advertisement?")) {
            try {
                await axios.delete(`http://localhost:5001/api/advertisements/${id}`);
                setApprovedAds(approvedAds.filter(ad => ad._id !== id));
                alert("Advertisement deleted successfully!");
            } catch (error) {
                console.error("Error deleting advertisement:", error);
                alert("Failed to delete advertisement.");
            }
        }
    };

    // ✏️ EDIT Advertisement (Open Form)
    const handleEdit = (ad) => {
        setEditAd(ad);
        setFormData({
            title: ad.title,
            description: ad.description,
            price: ad.price,
            facilities: ad.facilities.join(", "), 
            accommodationType: ad.AccommodationType
        });
    };

    // 📝 HANDLE UPDATE
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedAd = {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                facilities: formData.facilities.split(",").map(fac => fac.trim()), 
                AccommodationType: formData.accommodationType
            };

            await axios.put(`http://localhost:5001/api/advertisements/${editAd._id}`, updatedAd);
            alert("Advertisement updated successfully!");
            setEditAd(null);
            fetchApprovedAdvertisements(); // Refresh list
        } catch (error) {
            console.error("Error updating advertisement:", error);
            alert("Failed to update advertisement.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">My Approved Advertisements</h1>

            {loading ? (
                <p>Loading approved advertisements...</p>
            ) : approvedAds.length === 0 ? (
                <p>No approved advertisements available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedAds.map((ad) => (
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

                            {/* Buttons */}
                            <div className="flex gap-2 mt-2">
                                <button 
                                    onClick={() => handleEdit(ad)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(ad._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Form */}
            {editAd && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit Advertisement</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="border p-2 rounded w-full"
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="border p-2 rounded w-full"
                                required
                            />
                            <input
                                type="text"
                                name="facilities"
                                placeholder="Facilities (comma-separated)"
                                value={formData.facilities}
                                onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                                className="border p-2 rounded w-full"
                            />
                            <input
                                type="number"
                                name="price"
                                placeholder="Price (LKR)"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="border p-2 rounded w-full"
                                required
                            />
                            <select
                                name="accommodationType"
                                value={formData.accommodationType}
                                onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
                                className="border p-2 rounded w-full"
                                required
                            >
                                <option value="">Select Accommodation Type</option>
                                <option value="Boarding">Boarding</option>
                                <option value="Hostel">Hostel</option>
                                <option value="Annex">Annex</option>
                            </select>

                            <div className="flex justify-between">
                                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditAd(null)}
                                    className="bg-gray-500 text-white px-3 py-1 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBordings;
