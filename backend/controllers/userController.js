import User from '../models/User.js';

// Create a new user
export const createUser = async (req, res) => {
  const { name, phone, mobile } = req.body;

  try {
    const newUser = new User({
      name,
      phone,
      mobile,
      orders: [],
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: 'User created successfully', data: newUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, phone, mobile, orders } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, phone, mobile, orders },
      { new: true } // return updated user
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'User updated successfully', data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
