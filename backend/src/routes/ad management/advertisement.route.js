import express from "express";
import multer from "multer";
import {
  getApprovedAdvertisements,
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  approveAdvertisement,
  rejectAdvertisement,
  getVerifiedPaidAdvertisements,
  getMonthlyAdvertisementReport,
  getMyApprovedAdsWithPayment,
  getApprovedAdsWithoutVerifiedPayment,

  // filterByType,
  // getApprovedAdvertisements,
  // filterByPrice,
  // searchAdvertisements,
} from "../../controllers/ad management/advertisementController.js";

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

router.get("/approved-verified", getVerifiedPaidAdvertisements);
router.get("/approved", getApprovedAdvertisements);
router.get("/approved-populated", getMyApprovedAdsWithPayment);
router.get('/approved-unpaid', getApprovedAdsWithoutVerifiedPayment);

// Advertisement CRUD routes
router.post("/", upload.array("images", 5), createAdvertisement); // Create a new advertisement
 // Get all approved advertisements
router.get("/", getAllAdvertisements); // Get all advertisements
router.get("/:id", getAdvertisementById); // Get advertisement by ID
// router.put("/:id", updateAdvertisement); // Update advertisement
router.put("/:id", upload.array("images", 5), updateAdvertisement); // ✅ Enable file upload

router.delete("/:id", deleteAdvertisement); // Delete advertisement
router.put("/reject/:id", rejectAdvertisement); // Reject advertisement
router.get("/report/monthly", getMonthlyAdvertisementReport);

// // Advertisement search and filtering routes
// // ✅ Fetch all approved advertisements
// router.get("/search",getApprovedAdvertisements);

// // ✅ Filter advertisements by type
// router.get("/type/:type",filterByType);

// // ✅ Filter advertisements by price range
// router.get("/filter/price",filterByPrice);

// Advertisement approval route
router.put("/approve/:id", approveAdvertisement); // Approve advertisement

export default router;
