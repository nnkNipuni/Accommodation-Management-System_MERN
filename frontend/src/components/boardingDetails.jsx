
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";
import { motion } from "framer-motion"; // For animations

// Utility function to safely display fallback values
const safe = (value, fallback = "-") => (value !== undefined && value !== null && value !== "" ? value : fallback);

export default function BoardingDetails() {
  const { id } = useParams();
  const [advertisement, setAdvertisement] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  useEffect(() => {
    const fetchAdvertisementDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/advertisements/${id}`);
        let reviews = [];
  
        try {
          const reviewsResponse = await axios.get(`http://localhost:5001/api/reviews/advertisement/${id}`);
          if (Array.isArray(reviewsResponse.data)) {
            reviews = reviewsResponse.data;
          }
        } catch (reviewError) {
          console.warn("No reviews found or error fetching reviews:", reviewError.response?.data?.message || reviewError.message);
        }
  
        setAdvertisement({
          ...response.data,
          reviews,
          facilities: Array.isArray(response.data.facilities) ? response.data.facilities : [],
          images: Array.isArray(response.data.images) ? response.data.images : [],
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error("Advertisement not found.");
          setAdvertisement(null);
        } else {
          console.error("Error fetching advertisement details:", error);
        }
      }
    };
  
    fetchAdvertisementDetails();
  }, [id]);
  

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.text.trim()) {
      alert("Please provide a rating and review text.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`http://localhost:5001/api/reviews`, {
        advertisementId: id,
        rating: newReview.rating,
        text: newReview.text,
        // user: { username: "CurrentUser" }, // Replace with actual user data
        user: "67e3917310990e5106c37e00"
      });

      setAdvertisement((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), response.data],
      }));
      setNewReview({ rating: 0, text: "" });
      setIsReviewModalOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!advertisement) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen"
    >
      <div className="flex flex-col lg:flex-row gap-8 pt-24">
        {/* Left Side: Advertisement Info and Image Carousel */}
        <div className="lg:w-1/2">
          {/* Image Carousel */}
          {advertisement.images?.length > 0 ? (
            <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl shadow-lg mb-6">
              {/* <div className="relative bg-gradient-to-r from-grey-500 to-grey-600 p-4 rounded-xl shadow-lg mb-6"> */}
              <motion.img
                key={currentImage}
                src={`http://localhost:5001/${advertisement.images?.[currentImage] ?? "placeholder.jpg"}`}
                alt="Selected"
                className="w-full h-96 object-cover rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              {/* <div className="flex justify-center mt-4 gap-3">
                {advertisement.images.map((img, index) => (
                  <motion.img
                    key={index}
                    src={`http://localhost:5001/${img}`}
                    alt="Thumb"
                    className={`w-20 h-20 cursor-pointer rounded-lg ${
                      currentImage === index ? "border-4 border-white shadow-md" : "opacity-70"
                    }`}
                    onClick={() => setCurrentImage(index)}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                  />
                ))}
              </div> */}

<div className="flex justify-center mt-4 gap-3">
  {Array.isArray(advertisement.images) && advertisement.images.length > 0 ? (
    advertisement.images.map((img, index) => (
      <motion.img
        key={index}
        src={`http://localhost:5001/${img}`}
        alt="Thumb"
        className={`w-20 h-20 cursor-pointer rounded-lg ${
          currentImage === index ? "border-4 border-white shadow-md" : "opacity-70"
        }`}
        onClick={() => setCurrentImage(index)}
        whileHover={{ scale: 1.1, opacity: 1 }}
      />
    ))
  ) : (
    <p className="text-gray-500">No thumbnails available</p>
  )}
</div>

              <div className="absolute top-1/2 transform -translate-y-1/2 flex justify-between w-full px-4">
                <button
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev > 0 ? prev - 1 : advertisement.images.length - 1
                    )
                  }
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <FaArrowLeft className="text-indigo-600 text-xl" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImage((prev) =>
                      prev < advertisement.images.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                >
                  <FaArrowRight className="text-indigo-600 text-xl" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No images available</p>
          )}

          {/* Advertisement Details */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800">{safe(advertisement.title)}</h1>
            <p className="text-gray-600 mt-3 leading-relaxed">{safe(advertisement.description, "No description available")}</p>
            <p className="text-2xl font-semibold text-gray-700 mt-3">
              Rs. {safe(advertisement.price, "Not specified")}
            </p>
            <p className="text-gray-600 mt-1">Location: {safe(advertisement.location)}</p>
            {advertisement.facilities?.length > 0 ? (
              <div className="mt-4">
                <p className="font-semibold text-gray-700">Facilities:</p>
                
                {/* <ul className="list-disc list-inside text-gray-600">

                  {advertisement.facilities.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul> */}
                <ul className="list-disc list-inside text-gray-600">
  {Array.isArray(advertisement.facilities) && advertisement.facilities.length > 0 ? (
    advertisement.facilities.map((facility, index) => (
      <li key={index}>{facility}</li>
    ))
  ) : (
    <li>Facilities not available</li>
  )}
</ul>

              </div>
            ) : (
              <p className="mt-4 text-gray-500">Facilities: Not specified</p>
            )}
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-gray-700">Want to visit the place?</p>
                <motion.button
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reserve your slot
                </motion.button>
              </div>
              <div>
                <p className="text-gray-700">Satisfied with facilities?</p>
                <motion.button
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book your place
                </motion.button>
              </div>
            </div>
          </div>
        </div>
{/* Reviews Section */}
<div className="lg:w-1/2 lg:sticky lg:top-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
            {advertisement.reviews?.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      setCurrentReview((prev) =>
                        prev > 0 ? prev - 1 : advertisement.reviews.length - 1
                      )
                    }
                    className="bg-indigo-100 p-2 rounded-full hover:bg-indigo-200"
                  >
                    <FaArrowLeft className="text-indigo-600" />
                  </button>
                  <motion.div
                    key={currentReview}
                    className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg flex-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < (advertisement.reviews[currentReview]?.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="font-semibold text-gray-800 mt-2">
                      {advertisement.reviews[currentReview]?.user?.name ?? "Anonymous"}
                    </p>
                    <p className="text-gray-600">
                      {advertisement.reviews[currentReview]?.reviewDescription ?? "No review provided"}
                    </p>
                  </motion.div>
                  <button
                    onClick={() =>
                      setCurrentReview((prev) =>
                        prev < advertisement.reviews.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="bg-indigo-100 p-2 rounded-full hover:bg-indigo-200"
                  >
                    <FaArrowRight className="text-indigo-600" />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 mb-4">No reviews yet. Be the first to share your experience!</p>
            )}

            <motion.button
              onClick={() => setIsReviewModalOpen(true)}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add a Review
            </motion.button>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Your Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Rating</label>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`cursor-pointer text-2xl ${i < newReview.rating ? "text-yellow-400" : "text-gray-300"}`}
                      onClick={() => setNewReview((prev) => ({ ...prev, rating: i + 1 }))}
                    />
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Your Review</label>
                <textarea
                  value={newReview.text}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, text: e.target.value }))}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  rows="4"
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}