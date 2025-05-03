import Application from '../models/Application.js';

// View student applications (with optional pagination)
export const getMyApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination defaults
    const applications = await Application.find({ student: req.user._id }) // Fetch applications for the logged-in student
      .populate('job') // Populate the job field to get job details
      .skip((page - 1) * limit) // Skip based on page and limit
      .limit(limit) // Limit the number of applications
      .exec();

    const totalApplications = await Application.countDocuments({ student: req.user._id }); // Get total count of applications

    res.status(200).json({
      applications,
      totalApplications, // Send total number of applications for pagination UI
      totalPages: Math.ceil(totalApplications / limit), // Calculate total pages
      currentPage: page, // Current page
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    next(error); // Forward the error to the next middleware
  }
};
