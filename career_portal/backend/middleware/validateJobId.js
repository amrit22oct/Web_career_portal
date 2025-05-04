import mongoose from 'mongoose';

export const validateJobId = (req, res, next) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: 'Invalid job ID format' });
  }

  next();
};
