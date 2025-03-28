import express from "express";
import multer from "multer";
import {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  approvAdverticment,
  getAdvertisementsByCategory,
  searchAdvertisements,
} from "../controllers/admin/advertisementController.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Advertisement CRUD routes
router.post("/", upload.array("images", 5), createAdvertisement); // Create a new advertisement
router.get("/", getAllAdvertisements); // Get all advertisements
router.get("/:id", getAdvertisementById); // Get advertisement by ID
router.put("/:id", updateAdvertisement); // Update advertisement
router.delete("/:id", deleteAdvertisement); // Delete advertisement

// Advertisement search and filtering routes
router.get("/search", searchAdvertisements); // Search advertisements
router.get("/type/:AccommodationType", getAdvertisementsByCategory); // Get advertisements by category

// Advertisement approval route
router.put("/approve/:id", approvAdverticment); // Approve advertisement

export default router;
