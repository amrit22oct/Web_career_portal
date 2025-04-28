import Application from '../models/Application.js';

// View student applications
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user._id }).populate('job');
    res.json(applications);
  } catch (error) {
    next(error);
  }
};
