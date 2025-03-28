import React, { useState } from 'react';
import axios from 'axios';

const AddBoarding = () => {
    const [formData, setFormData] = useState({
        title: '',
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

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const base64Images = await Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        }));
        setFormData({ ...formData, images: base64Images });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

            // Prepare the data to send as JSON
        const dataToSend = {
            title: formData.title,
            description: formData.description,
            facilities: formData.facilities,
            price: formData.price,
            AccommodationType: formData.accommodationType,
            images: formData.images, // This will be an array of base64 strings
        };


        try {
            const response = await axios.post("http://localhost:5001/api/advertisements", dataToSend, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Boarding added:", response.data);
            alert("Boarding added successfully!");

            // Reset form after submission
            setFormData({
                title: '',
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
                    name="title"
                    placeholder="Advertisement title"
                    value={formData.title}
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


