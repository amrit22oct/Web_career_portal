export const recruiterOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ message: 'Access denied' });
  }

  next(); // Proceed to the next middleware or route handler
};
