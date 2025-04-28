import Job from '../models/Job.js';

// Post new job
export const createJob = async (req, res, next) => {
  try {
    const { title, description, company, location, salary } = req.body;
    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      recruiter: req.user._id,
    });
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};
