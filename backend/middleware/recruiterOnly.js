export const recruiterOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required: Not authorized' });
  }

  // Ensure role check is case-insensitive if needed
  if (req.user.role.toLowerCase() !== 'recruiter') {
    return res.status(403).json({ message: 'Access denied: You do not have recruiter permissions' });
  }

  next(); // Proceed to the next middleware or route handler
};
