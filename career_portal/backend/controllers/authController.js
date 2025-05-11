import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';
import Joi from 'joi'; // Use Joi for input validation

// Register User
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input using Joi
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid('student', 'recruiter').required(),
    });

    const { error } = schema.validate({ name, email, password, role });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// Login User
// Login User
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input using Joi
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate({ email, password });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate the token and include in the response
      const token = generateToken(user._id);
      return res.json({
        user: {
          _id: user._id,      // Ensuring user ID is included
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token, // Send token separately
      });
    } else {
      res.status(401).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    next(error);
  }
};


// Logout User
export const logoutUser = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Expire the cookie immediately
  });

  res.status(200).json({ message: 'Logged out successfully' });
};
