import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to check if the user is authenticated
export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from the authorization header
  if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET); // Decode the token and get the user ID
    req.user = await User.findById(id); // Find user by ID
    if (!req.user) throw new Error('User not found');
    
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// General middleware to check for specific roles
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role)
      return res.status(403).json({ message: `Access denied, ${role} role required` });
    next();
  };
};

// Middleware to ensure the user is a recruiter
export const recruiterOnly = checkRole('recruiter');

// Middleware to ensure the user is an admin
export const adminOnly = checkRole('admin');

// Export 'isAuthenticated' as 'protect' for convenience
export { isAuthenticated as protect };
