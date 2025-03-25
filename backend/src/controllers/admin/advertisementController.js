import Advertisement from '../../models/advertisement.model.js'; 
import mongoose from 'mongoose';

// Create a new advertisement
export const createAdvertisement = async (req, res) => {
  try {
    const { Adtitle, description, facilities, price, image, AccommodationType } = req.body;
    
    // Validate required fields
    if (!Adtitle || !description || !facilities || !price || !image || !AccommodationType) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newAdvertisement = new Advertisement({
      Adtitle,
      description,
      facilities,
      price,
      image,
      AccommodationType
    });
    
    const savedAdvertisement = await newAdvertisement.save();
    res.status(201).json(savedAdvertisement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating advertisement', error: error.message });
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

// Get advertisement by ID
// export const getAdvertisementById = async (req, res) => {
//   try {
//     const advertisement = await Advertisement.findById(req.params.id);
    
//     if (!advertisement) {
//       return res.status(404).json({ message: 'Advertisement not found' });
//     }
    
//     res.status(200).json(advertisement);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching advertisement', error: error.message });
//   }
// };

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

// Update advertisement
// export const updateAdvertisement = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
    
//     const advertisement = await Advertisement.findByIdAndUpdate(
//       id, 
//       updates, 
//       { new: true, runValidators: true }
//     );
    
//     if (!advertisement) {
//       return res.status(404).json({ message: 'Advertisement not found' });
//     }
    
//     res.status(200).json(advertisement);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating advertisement', error: error.message });
//   }
// };

// Delete advertisement
// export const deleteAdvertisement = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const advertisement = await Advertisement.findByIdAndDelete(id);
    
//     if (!advertisement) {
//       return res.status(404).json({ message: 'Advertisement not found' });
//     }
    
//     res.status(200).json({ message: 'Advertisement deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting advertisement', error: error.message });
//   }
// };

// Update advertisement
export const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid advertisement ID' });
    }

    const advertisement = await Advertisement.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    res.status(200).json(advertisement);
  } catch (error) {
    res.status(500).json({ message: 'Error updating advertisement', error: error.message });
  }
};

// Delete advertisement
export const deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid advertisement ID' });
    }

    const advertisement = await Advertisement.findByIdAndDelete(id);

    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }

    res.status(200).json({ message: 'Advertisement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting advertisement', error: error.message });
  }
};



// Get advertisements by category
export const getAdvertisementsByCategory = async (req, res) => {
  try {
    const { AccommodationType } = req.params;
    
    const advertisements = await Advertisement.find({ AccommodationType }).sort({ createdAt: -1 });
    
    res.status(200).json(advertisements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advertisements', error: error.message });
  }
};

// Search advertisements
// 

// Enhanced search advertisements function
export const searchAdvertisements = async (req, res) => {
  try {
    const { query, minPrice, maxPrice, type, facilities } = req.query;
    
    let searchCriteria = {};
    
    // Text search
    if (query) {
      searchCriteria.$or = [
        { Adtitle: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { AccommodationType: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Price range
    if (minPrice || maxPrice) {
      searchCriteria.price = {};
      if (minPrice) searchCriteria.price.$gte = Number(minPrice);
      if (maxPrice) searchCriteria.price.$lte = Number(maxPrice);
    }
    
    // Accommodation type
    if (type) {
      searchCriteria.AccommodationType = type;
    }
    
    // Facilities
    if (facilities) {
      const facilitiesArray = facilities.split(',');
      searchCriteria.facilities = { $all: facilitiesArray };
    }
    
    const advertisements = await Advertisement.find(searchCriteria).sort({ createdAt: -1 });
    
    res.status(200).json(advertisements);
  } catch (error) {
    res.status(500).json({ message: 'Error searching advertisements', error: error.message });
  }

};