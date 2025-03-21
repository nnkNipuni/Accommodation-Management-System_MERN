import User from '../../models/userModel.js'; // Import the User model


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error in fetching users", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const createUser = async (req, res) => {
    const user = req.body;
    if (!user.name || !user.email || !user.password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {
        const newUser = new User(user);
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error in creating user", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid user id" });
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Error in updating user", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid user id" });
    }
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleting user", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

