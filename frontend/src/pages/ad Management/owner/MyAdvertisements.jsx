

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminOwnerNavbar from "../../../components/AdminOwnerNavbar";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

import { X, MapPin, Upload } from "lucide-react";

const libraries = ["places"];

const MyAdvertisements = () => {
  const [markerPosition, setMarkerPosition] = useState({ lat: 7.8731, lng: 80.7718 });
  const [map, setMap] = useState(null);
  const autocompleteRef = useRef(null);

  const [approvedAds, setApprovedAds] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]); 
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    facilities: "",
    accommodationType: "",
    price: "",
    location: ""
  });

  // Validate title
  const validateTitle = (title) => {
    if (!title.trim()) {
      setErrors(prev => ({...prev, title: "Title is required"}));
      return false;
    }
    if (/^\d+$/.test(title)) {
      setErrors(prev => ({...prev, title: "Title cannot be numbers only"}));
      return false;
    }
    if (/^[^a-zA-Z0-9]+$/.test(title)) {
      setErrors(prev => ({...prev, title: "Title cannot be special characters only"}));
      return false;
    }
    if (!/[a-zA-Z]/.test(title)) {
      setErrors(prev => ({...prev, title: "Title must contain letters"}));
      return false;
    }
    setErrors(prev => ({...prev, title: ""}));
    return true;
  };

  // Validate description
  const validateDescription = (description) => {
    if (!description.trim()) {
      setErrors(prev => ({...prev, description: "Description is required"}));
      return false;
    }
    if (description.length < 30) {
      setErrors(prev => ({...prev, description: "Description must be at least 30 characters"}));
      return false;
    }
    setErrors(prev => ({...prev, description: ""}));
    return true;
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    if (!validateTitle(formData.title)) isValid = false;
    if (!validateDescription(formData.description)) isValid = false;
    if (formData.facilities.length === 0) {
      setErrors(prev => ({...prev, facilities: "Please add at least one facility"}));
      isValid = false;
    } else {
      setErrors(prev => ({...prev, facilities: ""}));
    }
    if (!formData.accommodationType) {
      setErrors(prev => ({...prev, accommodationType: "Please select accommodation type"}));
      isValid = false;
    } else {
      setErrors(prev => ({...prev, accommodationType: ""}));
    }
    if (!formData.price) {
      setErrors(prev => ({...prev, price: "Please enter price"}));
      isValid = false;
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      setErrors(prev => ({...prev, price: "Please enter a valid price"}));
      isValid = false;
    } else {
      setErrors(prev => ({...prev, price: ""}));
    }
    if (!formData.location) {
      setErrors(prev => ({...prev, location: "Please enter location"}));
      isValid = false;
    } else {
      setErrors(prev => ({...prev, location: ""}));
    }
    
    return isValid;
  };

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
      setErrors(prev => ({...prev, location: ""}));

      if (map) {
        map.setCenter(newPosition);
        map.setZoom(15);
      }
    });
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setFormData(prev => ({ ...prev, location: results[0].formatted_address }));
        setErrors(prev => ({...prev, location: ""}));
      }
    });
  };

  const handleMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setFormData(prev => ({ ...prev, location: results[0].formatted_address }));
        setErrors(prev => ({...prev, location: ""}));
      }
    });
  };

  useEffect(() => {
    fetchApprovedAdvertisements();
  }, []);

  const fetchApprovedAdvertisements = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/advertisements/approved-populated");
      const approvedAds = response.data;
      setApprovedAds(approvedAds);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching approved advertisements:", error);
      setLoading(false);
    }
  };

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

  const handleEdit = (ad) => {
    setEditAd(ad);
    setMarkerPosition(ad.latitude && ad.longitude ? { lat: ad.latitude, lng: ad.longitude } : { lat: 7.8731, lng: 80.7718 });
    setFormData({
      title: ad.title,
      description: ad.description,
      price: ad.price,
      facilities: ad.facilities,
      accommodationType: ad.AccommodationType,
      location: ad.location || "",
      images: ad.images || []
    });
    setErrors({
      title: "",
      description: "",
      facilities: "",
      accommodationType: "",
      price: "",
      location: ""
    });
    setNewImages([]);
    setPreviewImages([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const removeImage = (index) => {
    const newImages = [...newImages];
    newImages.splice(index, 1);
    setNewImages(newImages);
    
    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:5001/api/advertisements/${id}`, {
        enabled: !currentStatus
      });
      fetchApprovedAdvertisements();
    } catch (error) {
      console.error("Error toggling ad status:", error);
    }
  };

  const handleFacilityAdd = (e) => {
    const val = e.target.value;
    if (val && !formData.facilities.includes(val)) {
      setFormData(prev => ({ ...prev, facilities: [...prev.facilities, val] }));
      setErrors(prev => ({...prev, facilities: ""}));
    }
  };

  const removeFacility = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facility),
    }));
    if (formData.facilities.length === 1) {
      setErrors(prev => ({...prev, facilities: "Please add at least one facility"}));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate fields as they change
    if (name === "title") {
      validateTitle(value);
    } else if (name === "description") {
      validateDescription(value);
    } else if (name === "price") {
      if (!value) {
        setErrors(prev => ({...prev, price: "Please enter price"}));
      } else if (isNaN(value) || Number(value) <= 0) {
        setErrors(prev => ({...prev, price: "Please enter a valid price"}));
      } else {
        setErrors(prev => ({...prev, price: ""}));
      }
    } else if (name === "accommodationType") {
      if (!value) {
        setErrors(prev => ({...prev, accommodationType: "Please select accommodation type"}));
      } else {
        setErrors(prev => ({...prev, accommodationType: ""}));
      }
    } else if (name === "location") {
      if (!value) {
        setErrors(prev => ({...prev, location: "Please enter location"}));
      } else {
        setErrors(prev => ({...prev, location: ""}));
      }
    }
  };



  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    try {
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
  
      await axios.put(
        `http://localhost:5001/api/advertisements/${editAd._id}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      alert("Advertisement updated successfully!");
      setEditAd(null);
      setImagesToRemove([]);
      fetchApprovedAdvertisements();
    } catch (error) {
      console.error("Error updating advertisement:", error);
      alert("Failed to update advertisement.");
    }
  };
  

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <>
      <AdminOwnerNavbar role="owner" />
      <div className="p-4 pt-20">
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
                <p className="text-gray-800">Price: LKR {ad.price}</p>
                <p className="text-gray-600">Facilities: {ad.facilities.join(", ")}</p>
                <p className="text-gray-600">Type: {ad.AccommodationType}</p>
                <p className="text-gray-600">Location: {ad.location || "Not specified"}</p>

                <div className="mt-2">
                  {ad.images.length > 0 && (
                    <img
                      src={`http://localhost:5001/${ad.images[0]}`}
                      alt={ad.title}
                      className="w-full h-40 object-cover rounded"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-3 items-center">
                  <button onClick={() => handleEdit(ad)} className="border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-50">Edit</button>
                  <button onClick={() => handleDelete(ad._id)} className="border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-50">Delete</button>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={ad.enabled !== false} onChange={() => handleToggle(ad._id, ad.enabled !== false)} />
                    <span className="text-sm">Enabled</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {editAd && (
          <LoadScript googleMapsApiKey="AIzaSyBea4gs_gBa8W_WNY7dpW9gOMaS0PKjMNw" libraries={libraries} onLoad={initAutocomplete}>
            <div className="fixed inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 z-50">
              <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">Edit Advertisement</h2>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    {/* Title Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Boarding Title"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                      )}
                    </div>

                    {/* Description Textarea */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-3 border ${
                          errors.description ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Describe your boarding place in detail (minimum 30 characters)..."
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                      )}
                    </div>

                    {/* Facilities Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
                      <div className="flex gap-4">
                        <select 
                          onChange={handleFacilityAdd} 
                          className={`flex-1 px-4 py-2 border ${
                            errors.facilities ? "border-red-500" : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                          value=""
                        >
                          <option value="" disabled>Select a facility to add</option>
                          {["Air Conditioning", "Washing Machine", "Hot Water", "Free Wi-Fi"].map((facility) => (
                            <option key={facility} value={facility}>{facility}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Selected Facilities */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.facilities.map((facility) => (
                          <span 
                            key={facility} 
                            className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full flex items-center"
                          >
                            {facility}
                            <button 
                              type="button" 
                              onClick={() => removeFacility(facility)} 
                              className="ml-2 text-indigo-600 hover:text-indigo-800"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                      {errors.facilities && (
                        <p className="mt-1 text-sm text-red-600">{errors.facilities}</p>
                      )}
                    </div>

                    {/* Price and Accommodation Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price (LKR)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">Rs.</span>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 border ${
                              errors.price ? "border-red-500" : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="e.g. 25000"
                          />
                        </div>
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Type</label>
                        <select
                          name="accommodationType"
                          value={formData.accommodationType}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border ${
                            errors.accommodationType ? "border-red-500" : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        >
                          <option value="">Select Type</option>
                          <option value="Boarding">Boarding</option>
                          <option value="Hostel">Hostel</option>
                          <option value="Annex">Annex</option>
                        </select>
                        {errors.accommodationType && (
                          <p className="mt-1 text-sm text-red-600">{errors.accommodationType}</p>
                        )}
                      </div>
                    </div>

                    {/* Location Input and Map */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="location-input"
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Enter location in Sri Lanka"
                          className={`w-full pl-10 pr-4 py-3 border ${
                            errors.location ? "border-red-500" : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                      </div>
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                      )}
                      
                      <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-300">
                        <GoogleMap
                          mapContainerStyle={{ width: "100%", height: "100%" }}
                          center={markerPosition}
                          zoom={10}
                          onLoad={setMap}
                          onClick={handleMapClick}
                          options={{
                            gestureHandling: "cooperative",
                            fullscreenControl: false,
                            mapTypeControl: false,
                            streetViewControl: false,
                            zoomControl: true,
                            styles: [
                              {
                                featureType: "poi",
                                elementType: "labels",
                                stylers: [{ visibility: "off" }]
                              }
                            ]
                          }}
                        >
                          <Marker
                            position={markerPosition}
                            draggable={true}
                            onDragEnd={handleMarkerDragEnd}
                            icon={{
                              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                              scaledSize: { width: 32, height: 32 }
                            }}
                          />
                        </GoogleMap>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Click on the map or drag the marker to set the exact location
                      </p>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload New Images (Optional)
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB each)</p>
                          </div>
                          <input 
                            type="file" 
                            name="images" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            multiple 
                            className="hidden" 
                          />
                        </label>
                      </div>
                      
                      {/* New Image Previews */}
                      {previewImages.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {previewImages.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={preview} 
                                alt={`Preview ${index}`} 
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                     
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {formData.images
                          .filter(img => !imagesToRemove.includes(img))
                          .map((img, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={`http://localhost:5001/${img}`} 
                                alt={`Existing ${index}`} 
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImagesToRemove(prev => [...prev, img]);
                                }}
                                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
        </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="submit"
                        disabled={Object.values(errors).some(error => error)}
                        className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ${
                          Object.values(errors).some(error => error) ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                      >
                        Update
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setEditAd(null)} 
                        className="px-4 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </LoadScript>
        )}
      </div>
    </>
  );
};

export default MyAdvertisements;



