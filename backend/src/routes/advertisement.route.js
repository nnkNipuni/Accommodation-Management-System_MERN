import express from 'express';
import {
  createAdvertisement,
  getAllAdvertisements,
  getAdvertisementById,
  updateAdvertisement,
  deleteAdvertisement,
  getAdvertisementsByCategory,
  searchAdvertisements
} from '../controllers/admin/advertisementController.js';

const router = express.Router();

// Create a new advertisement
router.post('/', createAdvertisement);

// Get all advertisements
router.get('/', getAllAdvertisements);

// Search advertisements
router.get('/search', searchAdvertisements);

// Get advertisements by category
router.get('/type/:AccommodationType', getAdvertisementsByCategory);

// Get, update, delete a specific advertisement by ID
router.get('/:id', getAdvertisementById);
router.put('/:id', updateAdvertisement);
router.delete('/:id', deleteAdvertisement);

export default router;