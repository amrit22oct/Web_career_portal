import Application from '../models/Application.js';
import Job from "../models/Job.js";
// View student applications (with optional pagination)
// export const getMyApplications = async (req, res, next) => {
//   try {
//     const { page = 1, limit = 10 } = req.query; // Pagination defaults
//     const applications = await Application.find({ student: req.user._id }) // Fetch applications for the logged-in student
//       .populate('job') // Populate the job field to get job details
//       .skip((page - 1) * limit) // Skip based on page and limit
//       .limit(limit) // Limit the number of applications
//       .exec();

//     const totalApplications = await Application.countDocuments({ student: req.user._id }); // Get total count of applications

//     res.status(200).json({
//       applications,
//       totalApplications, // Send total number of applications for pagination UI
//       totalPages: Math.ceil(totalApplications / limit), // Calculate total pages
//       currentPage: page, // Current page
//     });
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     next(error); // Forward the error to the next middleware
//   }
// };

export const getAppliedJobs = async (req, res) => {
  const studentId = req.user._id;

  try {
    // Find applications by this student and populate the job and recruiter details
    const applications = await Application.find({ student: studentId })
      .populate({
        path: 'job',
        populate: { path: 'recruiter', select: 'companyName name email' },
      })
      .sort({ createdAt: -1 });

    res.json({ applications }); // respond as an object with applications array
  } catch (err) {
    console.error('Error fetching applied jobs:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
