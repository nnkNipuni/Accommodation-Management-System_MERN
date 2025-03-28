import Advertisement from "../../models/advertisement.model.js";
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Create new Ad
export const createAdvertisement = async (req, res) => {
  try {
    const { title, description, facilities, price, AccommodationType } = req.body;

    if (!title || !description || !facilities || !price || !AccommodationType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get uploaded file paths
    const imagePaths = req.files.map((file) => file.path);

    // Save advertisement to the database
    const newAdvertisement = new Advertisement({
      title,
      description,
      facilities: facilities.split(","),
      price,
      images: imagePaths, // Store paths instead of base64
      AccommodationType,
    });

    const savedAdvertisement = await newAdvertisement.save();
    res.status(201).json(savedAdvertisement);
  } catch (error) {
    console.error("Error creating advertisement:", error);
    res.status(500).json({ message: "Error creating advertisement", error: error.message });
  }
};


// Get all advertisements
export const getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find().sort({ createdAt: -1 });
    res.status(200).json(advertisements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advertisements', error: error.message });
  }
};


export const getAdvertisementById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid advertisement ID' });
    }

    const advertisement = await Advertisement.findById(id);

    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    res.status(200).json(advertisement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advertisement', error: error.message });
  }
};


// approved advertisement
export const approvAdverticment = async (req, res) => {
  try {
      const { id } = req.params;
      const updatedAd = await Advertisement.findByIdAndUpdate(id, req.body, { new: true });

      if (!updatedAd) {
          return res.status(404).json({ message: "Advertisement not found" });
      }

      res.status(200).json(updatedAd);
  } catch (error) {
      res.status(500).json({ message: "Error updating advertisement", error: error.message });
  }
};
//update asvertisement
export const updateAdvertisement = async (req, res) => {
  try {
      const { id } = req.params;
      const updatedData = req.body;

      const updatedAd = await Advertisement.findByIdAndUpdate(id, updatedData, { new: true });

      if (!updatedAd) {
          return res.status(404).json({ message: "Advertisement not found" });
      }

      res.status(200).json({ message: "Advertisement updated successfully", advertisement: updatedAd });
  } catch (error) {
      res.status(500).json({ message: "Error updating advertisement", error: error.message });
  }
};

// Delete advertisement
export const deleteAdvertisement = async (req, res) => {
  try {
      const { id } = req.params;

      const deletedAd = await Advertisement.findByIdAndDelete(id);

      if (!deletedAd) {
          return res.status(404).json({ message: "Advertisement not found" });
      }

      res.status(200).json({ message: "Advertisement deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting advertisement", error: error.message });
  }
};


// Get advertisements by category
export const getAdvertisementsByCategory = async (req, res) => {
  try {
    const { AccommodationType } = req.params;
    
    const advertisements = await Advertisement.find({ AccommodationType, approve: "Approved" }).sort({ createdAt: -1 });
    
    res.status(200).json(advertisements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advertisements', error: error.message });
  }
};

// Search advertisements

// Enhanced search advertisements function
export const searchAdvertisements = async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = query
      ? {
          approve: "Approved",
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
          ],
        }
      : { approve: "Approved" };

    const ads = await Advertisement.find(searchQuery);
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "Error searching advertisements", error });
  }
};

// ✅ Filter advertisements by accommodation type
export const filterByType = async (req, res) => {
  try {
    const { type } = req.params;
    const ads = await Advertisement.find({ approve: "Approved", accommodationType: type });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "Error filtering advertisements", error });
  }
};

// ✅ Fetch all approved advertisements
export const getApprovedAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({ approve: "Approved" });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching advertisements", error });
  }
};

// ✅ Filter advertisements by price range
export const filterByPrice = async (req, res) => {
  try {
    const { min, max } = req.query;
    const ads = await Advertisement.find({
      approve: "Approved",
      price: { $gte: min || 5000, $lte: max || 80000 },
    });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "Error filtering by price", error });
  }
};