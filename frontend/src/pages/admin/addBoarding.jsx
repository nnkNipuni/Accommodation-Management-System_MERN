
import React, { useState } from 'react';
import axios from 'axios';

const AddBoarding = () => {
    const [formData, setFormData] = useState({
        adTitle: '',
        description: '',
        facilities: '',
        images: [],
        accommodationType: '',
        price: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e) => {
        setFormData({ ...formData, images: Array.from(e.target.files) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("Adtitle", formData.adTitle);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("facilities", formData.facilities);
        formDataToSend.append("price", formData.price);
        formDataToSend.append("AccommodationType", formData.accommodationType);
        
        // Append images
        formData.images.forEach((image) => {
            formDataToSend.append("images", image);
        });

        try {
            const response = await axios.post("http://localhost:5001/api/advertisements", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Boarding added:", response.data);
            alert("Boarding added successfully!");

            // Reset form after submission
            setFormData({
                adTitle: '',
                description: '',
                facilities: '',
                images: [],
                accommodationType: '',
                price: '',
            });
        } catch (error) {
            console.error("Error adding boarding:", error.response?.data || error.message);
            alert("Failed to add boarding.");
        }
    };

    return (
        <div className="flex flex-col p-4">
            <h1 className="text-xl font-semibold mb-4">Add New Boarding</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="adTitle"
                    placeholder="Ad Title"
                    value={formData.adTitle}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                />
                <textarea
                    name="facilities"
                    placeholder="Facilities (comma-separated)"
                    value={formData.facilities}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price (LKR)"
                    value={formData.price}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                />
                <input
                    type="file"
                    name="images"
                    accept="image/*"
                    onChange={handleImageUpload}
                    multiple
                    className="border p-2 rounded w-full"
                />
                <select
                    name="accommodationType"
                    value={formData.accommodationType}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                >
                    <option value="">Select Accommodation Type</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Hostel">Hostel</option>
                    <option value="Annex">Annex</option>
                </select>
                <button type="submit" className="bg-black text-white p-2 rounded">
                    Add Boarding
                </button>
            </form>
        </div>
    );
};

export default AddBoarding;


