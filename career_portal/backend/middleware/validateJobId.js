import { Types } from 'mongoose';

export const validateJobId = (req, res, next) => {
  const { jobId } = req.params;

  if (!Types.ObjectId.isValid(jobId)) {
    return res.status(400).json({ message: 'Invalid job ID format' });
  }

  next(); // Proceed to the next middleware/controller if the jobId is valid
};
