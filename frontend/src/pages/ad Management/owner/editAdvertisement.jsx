// src/pages/ad Management/EditAdvertisement.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { MapPin, Upload, X } from "lucide-react";

const libraries = ["places"];

const EditAdvertisement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);

  const [editAd, setEditAd] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    facilities: [],
    accommodationType: "",
    location: "",
    images: []
  });
  const [markerPosition, setMarkerPosition] = useState({ lat: 7.8731, lng: 80.7718 });
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  const initAutocomplete = () => {
    if (!window.google || autocompleteRef.current) return;
    const inputElement = document.getElementById("location-input");
    if (!inputElement) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputElement, {
      componentRestrictions: { country: "LK" }
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry || !place.geometry.location) return;

      const newPosition = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setMarkerPosition(newPosition);
      setFormData(prev => ({
        ...prev,
        location: place.formatted_address || place.name
      }));
    });
  };

  const fetchAdDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/advertisements/${id}`);
      const ad = res.data;
      setEditAd(ad);
      setFormData({
        title: ad.title,
        description: ad.description,
        price: ad.price,
        facilities: ad.facilities,
        accommodationType: ad.AccommodationType,
        location: ad.location,
        images: ad.images
      });
      setMarkerPosition(ad.latitude && ad.longitude ? { lat: ad.latitude, lng: ad.longitude } : { lat: 7.8731, lng: 80.7718 });
    } catch (error) {
      console.error("Error loading ad:", error);
    }
  };

  useEffect(() => {
    fetchAdDetails();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setPreviewImages(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);

    const previews = [...previewImages];
    URL.revokeObjectURL(previews[index]);
    previews.splice(index, 1);
    setPreviewImages(previews);
  };

  const removeExistingImage = (img) => {
    setImagesToRemove(prev => [...prev, img]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFacilityAdd = (e) => {
    const val = e.target.value;
    if (val && !formData.facilities.includes(val)) {
      setFormData(prev => ({ ...prev, facilities: [...prev.facilities, val] }));
    }
  };

  const removeFacility = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facility),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("facilities", JSON.stringify(formData.facilities));
    form.append("accommodationType", formData.accommodationType);
    form.append("location", formData.location);
    form.append("latitude", markerPosition.lat);
    form.append("longitude", markerPosition.lng);
    form.append("imagesToRemove", JSON.stringify(imagesToRemove));
    newImages.forEach((img) => form.append("images", img));

    try {
      await axios.put(`http://localhost:5001/api/advertisements/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Advertisement updated successfully!");
      navigate("/rejected");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update.");
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyBea4gs_gBa8W_WNY7dpW9gOMaS0PKjMNw" libraries={libraries} onLoad={initAutocomplete}>
      <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded mt-8">
        <h2 className="text-xl font-bold mb-4">Edit Advertisement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" />
          <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Description" className="w-full p-2 border rounded" />
          <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" />
          <select name="accommodationType" value={formData.accommodationType} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select type</option>
            <option value="Boarding">Boarding</option>
            <option value="Annex">Annex</option>
            <option value="Hostel">Hostel</option>
          </select>
          <select onChange={handleFacilityAdd} value="">
            <option disabled value="">Add facility</option>
            {["Wi-Fi", "AC", "Washing Machine", "Kitchen"].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <div className="flex gap-2 flex-wrap">{formData.facilities.map(f => (
            <span key={f} className="bg-indigo-100 text-sm px-2 py-1 rounded">{f} <button type="button" onClick={() => removeFacility(f)}>×</button></span>
          ))}</div>

          <input name="location" id="location-input" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" />
          <div className="h-64 w-full">
            <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={markerPosition} zoom={12}>
              <Marker position={markerPosition} draggable onDragEnd={e => {
                const lat = e.latLng.lat(), lng = e.latLng.lng();
                setMarkerPosition({ lat, lng });
              }} />
            </GoogleMap>
          </div>

          <input type="file" accept="image/*" multiple onChange={handleImageChange} />
          <div className="flex gap-2 mt-2">{previewImages.map((src, i) => (
            <div key={i}><img src={src} alt="Preview" className="w-20 h-20 object-cover" /><button onClick={() => removeImage(i)}>×</button></div>
          ))}</div>

          <div className="mt-2">
            {formData.images?.filter(img => !imagesToRemove.includes(img)).map((img, i) => (
              <div key={i} className="inline-block mr-2"><img src={`http://localhost:5001/${img}`} alt="Existing" className="w-20 h-20 object-cover" />
                <button onClick={() => removeExistingImage(img)}>Remove</button>
              </div>
            ))}
          </div>

          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Update</button>
        </form>
      </div>
    </LoadScript>
  );
};

export default EditAdvertisement;
