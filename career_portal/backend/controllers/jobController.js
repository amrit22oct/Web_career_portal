import Job from "../models/Job.js";
import Application from "../models/Application.js";

// POST: Create a new job post
export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, skills } = req.body;

    if (!title || !description || !company || !location || !skills) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = new Job({
      title,
      description,
      company,
      location,
      salary,
      skills,
      recruiter: req.user._id,
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET: Fetch all jobs posted by the logged-in recruiter
export const getRecruiterJobs = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    const jobs = await Job.find({ recruiter: recruiterId }).populate(
      "recruiter",
      "name email"
    );

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Error fetching recruiter's jobs:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// GET: Fetch all jobs (for job listing page)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({}).populate("recruiter", "name email");

    if (!jobs || jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs available at the moment." });
    }

    console.log("Fetched jobs:", jobs); // Log to verify the structure of the returned jobs

    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Error fetching all jobs:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET: Get job by ID
export const getJobById = async (req, res) => {
  const { jobId } = req.params;

  try {
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await Job.findById(jobId)
      .populate("recruiter", "name email")
      .populate("applicants", "name email");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job details:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
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

    // Check if the logged-in user is the job's recruiter
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You do not have permission to update this job",
      });
    }

    // Update fields only if they are provided
    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (location !== undefined) job.location = location;
    if (salary !== undefined) job.salary = salary;
    if (skills !== undefined && Array.isArray(skills)) job.skills = skills;

    const updatedJob = await job.save();
    return res.status(200).json(updatedJob);
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

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this job" });
    }

    await Job.findByIdAndDelete(jobId);
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST: Add an applicant to a job
export const addApplicant = async (req, res) => {
  const { jobId } = req.params;
  const { studentId } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiter.toString() === studentId) {
      return res
        .status(400)
        .json({ message: "Recruiter cannot apply to their own job" });
    }

    if (job.applicants.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "Student already applied to this job" });
    }

    job.applicants.push(studentId);
    await job.save();

    const application = new Application({
      jobId,
      studentId,
      status: "Applied",
    });

    await application.save();

    return res
      .status(200)
      .json({ message: "Application submitted successfully", job });
  } catch (error) {
    console.error("Error adding applicant:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT: Update applicant status
export const updateApplicantStatus = async (req, res) => {
  const { jobId, studentId } = req.params;
  const { status } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const application = await Application.findOne({ jobId, studentId });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({ message: "Status updated", application });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE: Remove an applicant
export const removeApplicant = async (req, res) => {
  const { jobId, studentId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const index = job.applicants.indexOf(studentId);
    if (index === -1) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    job.applicants.splice(index, 1);
    await job.save();

    await Application.findOneAndDelete({ jobId, studentId });

    return res.status(200).json({ message: "Applicant removed" });
  } catch (error) {
    console.error("Error removing applicant:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
