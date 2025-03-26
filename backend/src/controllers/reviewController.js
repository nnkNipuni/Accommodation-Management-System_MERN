import Review from '../models/userReviews.model.js';
import Advertisement from '../models/advertisement.model.js';

export const createReview = async (req, res) => {
  try {
    const { reviewDescription, rating, user, advertisement } = req.body;

    const review = new Review({
      reviewDescription,
      rating,
      user,
      advertisement, // Refers to the Advertisement model
    });

    await review.save();

    // Also push the review reference into the advertisement's reviews array
    const advertisementToUpdate = await Advertisement.findById(advertisement);
    advertisementToUpdate.reviews.push(review._id);
    await advertisementToUpdate.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'username photo');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewsByAdvertisement = async (req, res) => {
    try {
      const { advertisementId } = req.params;
      console.log("Received advertisement ID:", advertisementId);
  
      if (!advertisementId) {
        return res.status(400).json({ error: "Advertisement ID is required" });
      }
  
      // Check if advertisementId is a valid MongoDB ObjectId
      if (!/^[0-9a-fA-F]{24}$/.test(advertisementId)) {
        return res.status(400).json({ error: "Invalid Advertisement ID format" });
      }
  
      // Fetch reviews related to the advertisement
      const reviews = await Review.find({ advertisement: advertisementId })
        .populate("user", "username photo") // Populate user details
        .sort({ createdAt: -1 }); // Sort reviews by newest first (optional)
  
      if (reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for this advertisement" });
      }
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: error.message });
    }
  };

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);

    // Optionally, remove the review reference from the advertisement's reviews array
    await Advertisement.updateMany(
      { reviews: id },
      { $pull: { reviews: id } }
    );

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
