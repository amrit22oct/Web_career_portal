import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';


export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, skills } = req.body;
    
    if (!title || !description || !company || !location || !skills) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newJob = new Job({
      title,
      description,
      company,
      location,
      salary,
      skills, // Add skills here
      recruiter: req.user._id, // Assuming the recruiter info is in req.user
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Get recruiter profile
export const getRecruiterProfile = async (req, res) => {
  try {
    const recruiter = await User.findById(req.user._id).select('-password');
    if (!recruiter) {
      return res.status(404).json({ success: false, message: 'Recruiter not found' });
    }
    res.status(200).json({ success: true, recruiter });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch recruiter profile', error });
  }
};

// ✅ Get all jobs posted by the recruiter
export const getJobs = async (req, res) => {
  try {
    // Check if the user is authenticated and `req.user` is populated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: Recruiter ID not found" });
    }

    // Extract recruiter ID from the `req.user` object (populated by auth middleware)
    const recruiterId = req.user._id;

    // Fetch jobs posted by this recruiter from the database
    const jobs = await Job.find({ recruiter: recruiterId }).populate("recruiter", "name email"); // Populate recruiter details if needed

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    // Log found jobs for debugging (can be removed in production)
    console.log('Jobs found:', jobs);

    // Return the jobs in the response
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    // Log error message for debugging
    console.error("Error fetching jobs:", error.message);

    // Return a server error response
    return res.status(500).json({ message: "Server error while fetching jobs" });
  }
};



// ✅ Get recruiter stats (total jobs posted, total applicants)
export const getRecruiterStats = async (req, res) => {
  try {
    const jobCount = await Job.countDocuments({ recruiter: req.user._id });

    const applications = await Application.find({}).populate('job', 'recruiter');
    const recruiterApplications = applications.filter(app => app.job.recruiter.equals(req.user._id));
    const applicantCount = recruiterApplications.length;

    res.status(200).json({
      success: true,
      stats: {
        jobCount,
        applicantCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error });
  }
};

// 📝 Update recruiter profile
export const editRecruiterProfile = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const updates = req.body;

    const updatedRecruiter = await User.findByIdAndUpdate(recruiterId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({ success: true, message: 'Profile updated', recruiter: updatedRecruiter });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update recruiter profile', error });
  }
};

// ❌ Delete recruiter account and associated jobs + applications
export const deleteRecruiterAccount = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // Delete jobs and applications related to the recruiter
    const jobs = await Job.find({ recruiter: recruiterId });
    const jobIds = jobs.map(job => job._id);

    await Application.deleteMany({ job: { $in: jobIds } });
    await Job.deleteMany({ recruiter: recruiterId });

    // Delete recruiter
    await User.findByIdAndDelete(recruiterId);

    res.status(200).json({ success: true, message: 'Recruiter account and all related data deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete account', error });
  }
};
