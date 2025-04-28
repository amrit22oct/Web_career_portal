import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id);
    if (!req.user) throw new Error();
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const recruiterOnly = (req, res, next) => {
  if (req.user.role !== 'recruiter')
    return res.status(403).json({ message: 'Access denied' });
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Access denied' });
  next();
};

export { isAuthenticated as protect }; // Export 'protect' function
