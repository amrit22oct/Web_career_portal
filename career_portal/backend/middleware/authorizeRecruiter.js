import Job from '../models/Job.js';

export const authorizeRecruiter = async (req, res, next) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    next(); // Proceed to the next middleware/controller if authorized
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
