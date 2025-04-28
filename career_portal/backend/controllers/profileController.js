import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    // req.user is set by our middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Return the user object directly
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    // Return the updated user (without password)
    const safeUser = user.toObject();
    delete safeUser.password;
    return res.json(safeUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
