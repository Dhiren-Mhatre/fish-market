import User from '../models/User.js';

// Create a new user
// Create a new user
export const createUser = async (req, res) => {
  const { name, phone, mobile, orders } = req.body;  // orders will be passed as an array

  try {
    const user = new User({
      name,
      phone,
      mobile,
      orders: orders || [],  // Make sure orders is an array or set it to empty if not provided
    });

    await user.save();
    return res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (error) {
    console.error(error); // Log error to help with debugging
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
// Update user details
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, phone, mobile, orderNumber } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Add the new order number to the existing orders array
    user.orders.push(orderNumber);

    // Update the user with new details
    user.name = name;
    user.phone = phone;
    user.mobile = mobile;

    await user.save();

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
