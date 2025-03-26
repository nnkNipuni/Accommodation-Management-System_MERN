import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function BoardingDetails() {
  const { id } = useParams();
  const [advertisement, setAdvertisement] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [currentReview, setCurrentReview] = useState(0); // Ensure index starts from 0

  useEffect(() => {
    const fetchAdvertisementDetails = async () => {
      try {
        console.log(id);
        const response = await axios.get(`http://localhost:5001/api/advertisements/${id}`);
        console.log("Advertisement data:", response.data);

        const reviewsResponse = await axios.get(`http://localhost:5001/api/reviews/advertisement/${id}`);
        console.log("Reviews data:", reviewsResponse.data);

        // Ensure reviews are always an array (to prevent `undefined` errors)
        setAdvertisement({
          ...response.data,
          reviews: Array.isArray(reviewsResponse.data) ? reviewsResponse.data : [],
        });
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchAdvertisementDetails();
  }, [id]);

  if (!advertisement) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto text-center">
      {/* Image Carousel */}
      <div className="mb-4">
        {advertisement.image?.length > 0 && (
          <>
            <img src={advertisement.image[currentImage]} alt="Selected" className="w-full h-60 object-cover" />
            <div className="flex justify-center mt-2 gap-2">
              {advertisement.image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Thumb"
                  className={`w-16 h-16 cursor-pointer ${currentImage === index ? "border-2 border-black" : ""}`}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <button onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : advertisement.image.length - 1))}>
                <FaArrowLeft />
              </button>
              <button onClick={() => setCurrentImage((prev) => (prev < advertisement.image.length - 1 ? prev + 1 : 0))}>
                <FaArrowRight />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Booking Section */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">{advertisement.Adtitle}</h1>
        <p className="text-gray-500">{advertisement.description}</p>
        <p className="text-lg font-bold">Rs. {advertisement.price}</p>

        {advertisement.facilities?.length > 0 && <p className="mt-2">Facilities: {advertisement.facilities.join(", ")}</p>}

        <p>Want to visit the place? Make an appointment</p>
        <button className="bg-black text-white px-4 py-2 mt-2">Reserve your slot</button>
        <p className="mt-4">Satisfied with facilities?</p>
        <button className="bg-black text-white px-4 py-2 mt-2">Book your place</button>
      </div>

      {/* Reviews Carousel */}
      {advertisement.reviews?.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Reviews</h2>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() =>
                setCurrentReview((prev) => (prev > 0 ? prev - 1 : advertisement.reviews.length - 1))
              }
            >
              <FaArrowLeft />
            </button>
            <div className="bg-black text-white p-4 rounded-lg w-64 text-center">
              <p className="text-yellow-400">
                {"⭐".repeat(advertisement.reviews?.[currentReview]?.rating ?? 0)}
              </p>
              <p className="font-bold">{advertisement.reviews?.[currentReview]?.user?.username ?? "Anonymous"}</p>
              <p>{advertisement.reviews?.[currentReview]?.text ?? "No review provided"}</p>
            </div>
            <button
              onClick={() =>
                setCurrentReview((prev) => (prev < advertisement.reviews.length - 1 ? prev + 1 : 0))
              }
            >
              <FaArrowRight />
            </button>
          </div>
          <button className="bg-black text-white px-4 py-2 mt-4">Add a review</button>
        </div>
      ) : (
        <p className="mt-6">No reviews yet.</p>
      )}
    </div>
  );
}
