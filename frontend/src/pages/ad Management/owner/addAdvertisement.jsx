import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import AdminOwnerNavbar from "../../../components/AdminOwnerNavbar";
import { Upload, X, MapPin, Home, Wifi, Droplet, Wind, Clock } from "lucide-react";

const libraries = ["places"];

const AddBoarding = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    facilities: [],
    accommodationType: "",
    price: "",
    location: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [markerPosition, setMarkerPosition] = useState({ lat: 7.8731, lng: 80.7718 });
  const [map, setMap] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    facilities: "",
    accommodationType: "",
    price: "",
    location: ""
  });
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null); // Add a ref for the input element

  // Facility icons mapping
  const facilityIcons = {
    "Air Conditioning": <Wind size={16} className="mr-1" />,
    "Washing Machine": <Droplet size={16} className="mr-1" />,
    "Hot Water": <Droplet size={16} className="mr-1" />,
    "Free Wi-Fi": <Wifi size={16} className="mr-1" />,
  };

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
  
    if (selectedImages.length === 0) {
      alert("Please upload at least one image.");
      isValid = false;
    }
  
    return isValid;
  };

  // Handle image selection and preview
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Remove an image from selection
  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
    
    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  // Initialize Google Places Autocomplete
  const initAutocomplete = () => {
    console.log("Initializing autocomplete...");
    
    // Check if Google Maps API is loaded
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps Places API not loaded yet");
      return;
    }
    
    // Check if autocomplete is already initialized
    if (autocompleteRef.current) {
      console.log("Autocomplete already initialized");
      return;
    }
    
    // Get the input element
    const inputElement = document.getElementById("location-input");
    if (!inputElement) {
      console.error("Location input element not found");
      return;
    }
    
    console.log("Creating autocomplete instance...");
    
    try {
      // Create the autocomplete instance
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputElement, {
        componentRestrictions: { country: "LK" },
        fields: ["formatted_address", "geometry", "name"], // Specify the data fields to improve performance
        types: ["geocode", "establishment"] // Restrict to addresses and establishments
      });
      
      console.log("Autocomplete instance created successfully");
      
      // Add listener for place selection
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        console.log("Place selected:", place);
        
        if (!place.geometry || !place.geometry.location) {
          console.error("No details available for this place");
          return;
        }
        
        // Update form data with the selected place
        setFormData(prev => ({...prev, location: place.formatted_address || place.name}));
        setErrors(prev => ({...prev, location: ""}));
        
        // Update marker position
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setMarkerPosition(newPosition);
        
        // Center the map on the selected location
        if (map) {
          map.setCenter(newPosition);
          map.setZoom(15);
        }
      });
    } catch (error) {
      console.error("Error initializing Places Autocomplete:", error);
    }
  };

  // Use effect to initialize autocomplete after component mounts and input is available
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initAutocomplete();
      } else {
        console.log("Waiting for Google Maps API to load...");
      }
    }, 1000); // Wait a second to ensure DOM and Google APIs are ready
    
    return () => clearTimeout(timer);
  }, []);
  
  // Listen for Google Maps API script load event
  useEffect(() => {
    const handleGoogleMapsLoaded = () => {
      console.log("Google Maps API loaded");
      initAutocomplete();
    };
    
    if (window.google && window.google.maps && window.google.maps.places) {
      handleGoogleMapsLoaded();
    } else {
      window.addEventListener('google-maps-script-loaded', handleGoogleMapsLoaded);
      return () => {
        window.removeEventListener('google-maps-script-loaded', handleGoogleMapsLoaded);
      };
    }
  }, []);

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

  const handleFacilityAdd = (e) => {
    const val = e.target.value;
    if (val && !formData.facilities.includes(val)) {
      setFormData((prev) => ({ ...prev, facilities: [...prev.facilities, val] }));
      setErrors(prev => ({...prev, facilities: ""}));
    }
  };

  const removeFacility = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((f) => f !== facility),
    }));
    if (formData.facilities.length === 1) {
      setErrors(prev => ({...prev, facilities: "Please add at least one facility"}));
    }
  };

  const handleMapClick = (e) => {
    const clickedLat = e.latLng.lat();
    const clickedLng = e.latLng.lng();
    setMarkerPosition({ lat: clickedLat, lng: clickedLng });
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat: clickedLat, lng: clickedLng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setFormData(prev => ({...prev, location: results[0].formatted_address}));
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
        setFormData(prev => ({...prev, location: results[0].formatted_address}));
        setErrors(prev => ({...prev, location: ""}));
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("description", formData.description);
    dataToSend.append("facilities", JSON.stringify(formData.facilities));
    dataToSend.append("price", formData.price);
    dataToSend.append("accommodationType", formData.accommodationType);
    dataToSend.append("location", formData.location);
    dataToSend.append("latitude", markerPosition.lat);
    dataToSend.append("longitude", markerPosition.lng);
    selectedImages.forEach((file) => dataToSend.append("images", file));

    try {
      const response = await axios.post("http://localhost:5001/api/advertisements", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form on success
      setFormData({ 
        title: "", 
        description: "", 
        facilities: [], 
        accommodationType: "", 
        price: "", 
        location: "" 
      });
      setSelectedImages([]);
      setPreviewImages([]);
      setMarkerPosition({ lat: 7.8731, lng: 80.7718 });
      setErrors({
        title: "",
        description: "",
        facilities: "",
        accommodationType: "",
        price: "",
        location: ""
      });
      
      alert("Advertisement sent for admin approval!");
      console.log("Boarding added:", response.data);
    } catch (error) {
      console.error("Error adding boarding:", error.response?.data || error.message);
      alert("Failed to add boarding. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AdminOwnerNavbar role="owner" />
      <LoadScript 
        googleMapsApiKey="AIzaSyBea4gs_gBa8W_WNY7dpW9gOMaS0PKjMNw" 
        libraries={libraries}
        onLoad={() => {
          console.log("LoadScript onLoad callback");
          // Dispatch a custom event when Google Maps script is loaded
          window.dispatchEvent(new Event('google-maps-script-loaded'));
        }}
      >
        <div className="min-h-screen bg-gray-50 p-4 pt-20">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Home className="mr-2 text-indigo-600" size={24} />
                Add New Boarding Place
              </h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Boarding Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Cozy Apartment Near University"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Describe your boarding place in detail (minimum 30 characters)..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Facilities Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facilities
                  </label>
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
                        {facilityIcons[facility] || <Clock size={16} className="mr-1" />}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Price (LKR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">Rs.</span>
                      <input
                        type="number"
                        name="price"
                        placeholder="e.g. 25000"
                        value={formData.price}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border ${
                          errors.price ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accommodation Type
                    </label>
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

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images (Optional)
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
                        onChange={handleImageUpload} 
                        multiple 
                        className="hidden" 
                      />
                    </label>
                  </div>
                  
                  {/* Image Previews */}
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
                </div>

                {/* Location Input and Map */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="location-input"
                      ref={inputRef} // Add ref to the input
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

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || Object.values(errors).some(error => error)}
                    className={`w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Add Boarding Place"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </LoadScript>
    </>
  );
};

export default AddBoarding;