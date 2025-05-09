import Job from '../models/Job.js'; // Assuming you have a Job model set up
import Application from '../models/Application.js'; // Assuming you have an Application model set up
import User from '../models/User.js';
// POST: Create a new job post


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



// GET: Get all jobs (for job listing page)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate("recruiter", "name email");

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs available at the moment." });
    }

    console.log("Fetched jobs:", jobs); // Log to verify the structure of the returned jobs

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching all jobs:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};



// GET: Fetch all jobs posted by the recruiter






// GET: Get job by ID (for viewing applicants or job details)
export const getJobById = async (req, res) => {
  const { jobId } = req.params;

  try {
    // Ensure jobId is valid
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Fetch job by ID
    const job = await Job.findById(jobId).populate('applicants');
    
    // Check if the job exists
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    // Log the full error for debugging
    console.error("Error fetching job details:", error);

    // Return a more detailed error message
    return res.status(500).json({
      message: "Server error",
      error: error.message, // Include the specific error message
      stack: error.stack,   // Optionally, include the stack trace for debugging
    });
  }
};



// PUT: Update a job post
export const updateJob = async (req, res) => {
  const { jobId } = req.params;
  const { title, description, location, salary, skills } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to update this job" });
    }

    job.title = title || job.title;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.skills = skills || job.skills;

    await job.save();
    return res.status(200).json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE: Delete a job post
export const deleteJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to delete this job" });
    }

    await Job.findByIdAndDelete(jobId);
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST: Add an applicant to a job (when a student applies)
export const addApplicant = async (req, res) => {
  const { jobId } = req.params;
  const { studentId } = req.body; // Assuming studentId is passed when they apply

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId.toString() === req.user.id) {
      return res.status(400).json({ message: "Recruiter cannot apply to their own job" });
    }

    if (job.applicants.includes(studentId)) {
      return res.status(400).json({ message: "Student has already applied for this job" });
    }

    job.applicants.push(studentId);
    await job.save();

    // Optionally, create an application record (could be useful for tracking status, etc.)
    const application = new Application({
      jobId,
      studentId,
      status: 'Applied', // You can use different statuses like 'Applied', 'Under Review', 'Interview Scheduled'
    });

    await application.save();

    return res.status(200).json({ message: "Application submitted successfully", job });
  } catch (error) {
    console.error("Error adding applicant:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT: Update applicant status (e.g., move from 'Applied' to 'Interview Scheduled')
export const updateApplicantStatus = async (req, res) => {
  const { jobId, studentId } = req.params;
  const { status } = req.body; // Status should be 'Under Review', 'Interview Scheduled', etc.

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to update this applicant's status" });
    }

    const application = await Application.findOne({ jobId, studentId });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({ message: "Applicant status updated", application });
  } catch (error) {
    console.error("Error updating applicant status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE: Remove an applicant from the job (e.g., rejection)
export const removeApplicant = async (req, res) => {
  const { jobId, studentId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You do not have permission to remove this applicant" });
    }

    const index = job.applicants.indexOf(studentId);
    if (index === -1) {
      return res.status(404).json({ message: "Applicant not found for this job" });
    }

    job.applicants.splice(index, 1);
    await job.save();

    // Optionally remove the application from the Application model
    await Application.findOneAndDelete({ jobId, studentId });

    return res.status(200).json({ message: "Applicant removed successfully" });
  } catch (error) {
    console.error("Error removing applicant:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
