import Job from '../models/Job.js';

// Get all jobs
export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({});
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};
