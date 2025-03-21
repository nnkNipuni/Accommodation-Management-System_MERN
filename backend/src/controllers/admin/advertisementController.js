import Advertisement from '../../models/advertisement.model.js'; 

// Create a new advertisement
export const createAdvertisement = async (req, res) => {
  try {
    const { Adtitle, description, facilities, price, image, category } = req.body;
    
    // Validate required fields
    if (!Adtitle || !description || !facilities || !price || !image || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const newAdvertisement = new Advertisement({
      Adtitle,
      description,
      facilities,
      price,
      image,
      category
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
export const getAdvertisementById = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);
    
    if (!advertisement) {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
    
    res.status(200).json(advertisement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advertisement', error: error.message });
  }
};

// Update advertisement
export const updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const advertisement = await Advertisement.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );
    
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
    const { category } = req.params;
    
    const advertisements = await Advertisement.find({ category }).sort({ createdAt: -1 });
    
    res.status(200).json(advertisements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching advertisements', error: error.message });
  }
};

// Search advertisements
export const searchAdvertisements = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const advertisements = await Advertisement.find({
      $or: [
        { Adtitle: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { facilities: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.status(200).json(advertisements);
  } catch (error) {
    res.status(500).json({ message: 'Error searching advertisements', error: error.message });
  }
};