export const recruiterOnly = (req, res, next) => {
  // Check if user is authenticated (req.user should be set by your authentication middleware)
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  // Check if the user has the role of 'recruiter'
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ message: 'Access denied' });
  }

  // If the user is a recruiter, proceed to the next middleware or route handler
  next();
};
