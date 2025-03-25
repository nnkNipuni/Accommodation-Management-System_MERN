// import Review from '../models/userReviews.model.js';
// import Advertisement from '../models/advertisement.model.js';

// export const createReview = async (req, res) => {
//   try {
//     const { reviewDescription, rating, user,advertisement } = req.body;

//     const review = new Review({
//       reviewDescription,
//       rating,
//       user,
//       advertisement // Refers to the User collection
//     });

//     await review.save();
//     res.status(201).json({ message: 'Review added successfully', review });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getAllReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find().populate('user', 'username photo');
//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // export const getReviewsByAdvertisement = async (req, res) => {
// //     try {
// //       const { advertisementId } = req.params;
// //       if (!advertisementId) {
// //         return res.status(400).json({ error: "Advertisement ID is required" });
// //       }
  
// //       // Find the advertisement and populate reviews
// //       const advertisement = await Advertisement.findById(advertisementId)
// //         .populate('reviews') // Populate reviews field with associated reviews
// //         .populate('reviews.user', 'name') // Populate user details for each review
// //         .populate("user", "name") // Show user details for the advertisement
// //         .populate("advertisement", "Adtitle"); // Show ad title
  
// //       if (!advertisement) {
// //         return res.status(404).json({ error: "Advertisement not found" });
// //       }
  
// //       // If no reviews exist, you could either return an empty array or a custom message
// //       if (advertisement.reviews.length === 0) {
// //         return res.status(404).json({ message: "No reviews found for this advertisement" });
// //       }
  
// //       res.status(200).json(advertisement);
// //     } catch (error) {
// //       console.error("Error fetching reviews:", error);
// //       res.status(500).json({ error: error.message });
// //     }
// //   };
// export const getReviewsByAdvertisement = async (req, res) => {
//     try {
//       const { advertisementId } = req.params;
  
//       if (!advertisementId) {
//         return res.status(400).json({ error: "Advertisement ID is required" });
//       }
  
//       // Find the advertisement and populate the reviews
//       const advertisement = await Advertisement.findById(advertisementId)
//         .populate('reviews') // Populates reviews for the advertisement
//         .populate('reviews.user', 'username photo') // Populates the user details for each review
//         // .populate('user', 'name') // Populates the user details for the advertisement
//         // .populate('advertisement', 'Adtitle'); // Populates the ad title for the advertisement
  
//       if (!advertisement) {
//         return res.status(404).json({ error: "Advertisement not found" });
//       }
  
//       if (advertisement.reviews.length === 0) {
//         return res.status(404).json({ message: "No reviews found for this advertisement" });
//       }
  
//       res.status(200).json(advertisement);
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//       res.status(500).json({ error: error.message });
//     }
//   };
  

// export const deleteReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Review.findByIdAndDelete(id);
//     res.status(200).json({ message: 'Review deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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
      return res.status(400).json({ error: 'Advertisement ID is required' });
    }
    // Check if the advertisementId is valid
    if (!/^[0-9a-fA-F]{24}$/.test(advertisementId)) {
        return res.status(400).json({ error: "Invalid Advertisement ID format" });
    }
    const advertisement = await Advertisement.findById(advertisementId)
    //   .populate({
    //     path: 'reviews',
    //     populate: {
    //       path: 'user', // Populates the user within the review
    //       select: 'username photo', // You can select specific fields
    //     },
    //   });
    .populate('reviews')
            .populate('reviews.user', 'username photo')
            .populate('user', 'name')
            .populate('advertisement', 'Adtitle');


    if (!advertisement) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    if (advertisement.reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this advertisement' });
    }

    res.status(200).json(advertisement);
  } catch (error) {
    console.error('Error fetching reviews:', error);
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
