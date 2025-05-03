import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with your secret key
    req.user = decoded; // Attach user data to the request
    next(); // Proceed to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
