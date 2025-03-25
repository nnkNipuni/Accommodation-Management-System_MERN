import express from "express";

    import {
        createReview,
        getAllReviews,
        deleteReview,
        getReviewsByAdvertisement
        
    } from "../controllers/reviewController.js";


const router = express.Router();

router.post('/', createReview); // Create a review
router.get('/', getAllReviews); // Get all reviews
router.get("/advertisement/:advertisementId", (req, res, next) => {
    console.log("Hit the route to fetch reviews for advertisement ID:", req.params.advertisementId);
    next();
  }, getReviewsByAdvertisement); // Get reviews by advertisement ID
router.delete('/:id', deleteReview); // Delete a review by ID

export default router;
