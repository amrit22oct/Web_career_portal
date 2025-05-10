import mongoose from 'mongoose';

export const validateJobId = (req, res, next) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: 'Invalid job ID format. Ensure it is a valid MongoDB ObjectId.' });
  }

  // Optionally log invalid ID for debugging
  console.log(`Invalid Job ID format: ${jobId}`);

  next(); // Proceed to the next middleware or route handler
};
