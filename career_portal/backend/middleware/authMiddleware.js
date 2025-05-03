import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to check if the user is authenticated
export const isAuthenticated = async (req, res, next) => {
  // Extract token from the authorization header
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    // Verify token and extract user ID
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID and attach to req.user
    req.user = await User.findById(id);
    if (!req.user) throw new Error('User not found');
    
    // Proceed to the next middleware
    next();
  } catch (error) {
    // If any error occurs, return Unauthorized response
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to ensure the user is a recruiter
export const recruiterOnly = (req, res, next) => {
  // Check if user has 'recruiter' role
  if (req.user.role !== 'recruiter')
    return res.status(403).json({ message: 'Access denied' });
  next(); // Proceed to the next middleware/route handler
};

// Middleware to ensure the user is an admin
export const adminOnly = (req, res, next) => {
  // Check if user has 'admin' role
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Access denied' });
  next(); // Proceed to the next middleware/route handler
};

// Export 'isAuthenticated' as 'protect' for convenience
export { isAuthenticated as protect };
