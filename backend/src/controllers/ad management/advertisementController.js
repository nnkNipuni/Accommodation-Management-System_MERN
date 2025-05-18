import Advertisement from "../../models/ad management/advertisement.model.js";
import Payment from "../../models/finance/payment.model.js";
import mongoose from 'mongoose';

// Create new Ad
export const createAdvertisement = async (req, res) => {
  try {
    const { title, description, facilities, price, accommodationType, location } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];   //Ensures uploaded images are processed only if present.

    if (!title || !description || !facilities || !price || !accommodationType ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get uploaded file paths
    const imagePaths = req.files.map((file) => file.path);

  

    const newAdvertisement = new Advertisement({
      title,
      description,
      facilities: facilities.split(","),
      price,
      images: imagePaths,
      AccommodationType: accommodationType,
      location,
      enabled: true,
      approve: "Pending" 
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
    
    const advertisements = await Advertisement.find({ AccommodationType, approve: "Approved",enabled: true }).sort({ createdAt: -1 });
    
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
          enabled: true,
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
          ],
        }
      : { approve: "Approved", enabled:true };

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
    const ads = await Advertisement.find({ approve: "Approved", accommodationType: type, enabled: true });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "Error filtering advertisements", error });
  }
};

// ✅ Fetch all approved advertisements
export const getApprovedAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({ approve: "Approved", $or: [{ enabled: true }, { enabled: { $exists: false } }] });
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
      enabled: true,
      price: { $gte: min || 5000, $lte: max || 80000 },
    });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "Error filtering by price", error });
  }
};



export const rejectAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    console.log("Rejecting Ad ID:", id);
    console.log("Rejection Reason:", rejectionReason);

    const updatedAd = await Advertisement.findByIdAndUpdate(
      id,
      { approve: "Rejected", rejectionReason },
      { new: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    res.status(200).json({ message: "Advertisement rejected", updatedAd });
  } catch (error) {
    console.error("🔥 Error in rejectAdvertisement:", error);
    res.status(500).json({ message: "Error rejecting advertisement", error: error.message });
  }
};




export const getVerifiedPaidAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find({
      approve: "Approved",
      enabled: true // ✅ Only get enabled ads
    }).populate("paymentStatus");

    const verifiedAds = ads.filter(ad =>
      ad.paymentStatus && ad.paymentStatus.status === "Verified"
    );

    res.status(200).json(verifiedAds);
  } catch (error) {
    res.status(500).json({ message: "Error fetching verified advertisements", error: error.message });
  }
};

// approved advertisement
export const approveAdvertisement = async (req, res) => {
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

//added today
// Get all approved advertisements with payment status
export const getMyApprovedAdsWithPayment = async (req, res) => {
  try {
    const { ownerId } = req.query;

    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required" });
    }

    const ads = await Advertisement.find({
      approve: "Approved",
      owner: ownerId  // assuming you store owner in a field called 'owner'
    })
      .populate("paymentStatus")
      .sort({ createdAt: -1 });

    res.status(200).json(ads);
  } catch (error) {
    console.error("Error fetching my ads with payment status:", error);
    res.status(500).json({ message: "Error fetching advertisements", error: error.message });
  }
};



export const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await Advertisement.findById(id);
    if (!ad) {
      return res.status(404).json({ message: "Advertisement not found" });
    }

    const isMultipart = req.headers['content-type']?.includes('multipart/form-data');
    const imagesToRemove = req.body.imagesToRemove ? JSON.parse(req.body.imagesToRemove) : [];  //Handles optional image removal, only parsing JSON if provided.

    if (isMultipart) {
      const {
        title,
        description,
        facilities,
        price,
        accommodationType,
        location,
      } = req.body;

      const newImages = req.files ? req.files.map(file => file.path) : [];

      // Filter out images to remove from existing ones
      const updatedImages = ad.images.filter(img => !imagesToRemove.includes(img));
      const combinedImages = [...updatedImages, ...newImages];

      ad.title = title;
      ad.description = description;
      ad.facilities = facilities ? facilities.split(",").map(f => f.trim()) : [];
      ad.price = price;
      ad.AccommodationType = accommodationType;
      ad.location = location;
      ad.images = combinedImages;
    } else {
      Object.assign(ad, req.body);
    }

    const updatedAd = await ad.save();

    res.status(200).json({
      message: "Advertisement updated successfully",
      advertisement: updatedAd,
    });
  } catch (error) {
    console.error("Error updating advertisement:", error);
    res.status(500).json({
      message: "Error updating advertisement",
      error: error.message,
    });
  }
};


export const getMonthlyAdvertisementReport = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

    const ads = await Advertisement.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      approve: "Approved",
      enabled: true
    }).populate("paymentStatus");

    const verifiedAds = ads.filter(ad => 
      ad.paymentStatus && ad.paymentStatus.status === "Verified"
    );

    res.status(200).json({
      month: startOfMonth.toLocaleString('default', { month: 'long' }),
      year: startOfMonth.getFullYear(),
      count: verifiedAds.length,
      ads: verifiedAds
    });
  } catch (error) {
    console.error("Error generating monthly report:", error);
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
};

