import Job from '../models/Job.js';

// POST: Create a new job post
export const createJob = async (req, res, next) => {
  try {
    const { title, description, company, location, salary, skills } = req.body;

    // Validate required fields
    if (!title || !description || !company || !location || !salary || !skills) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create the job post
    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      skills,
      recruiter: req.user._id, // Associate the recruiter with the job post
    });

    res.status(201).json(job); // Return the created job
  } catch (error) {
    console.error("Error creating job:", error);
    next(error); // Forward the error to the next middleware for better handling
  }
};

// GET: Fetch all jobs posted by the recruiter (with pagination)
export const getJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Pagination defaults
    const jobs = await Job.find({ recruiter: req.user._id }) // Fetch jobs for the logged-in recruiter
                         .skip((page - 1) * limit)
                         .limit(limit)
                         .exec();

    return res.status(200).json(jobs); // Return the list of jobs
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET: Fetch a single job by its ID (with applicants populated)
export const getJobById = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId)
                         .populate('applicants') // Populate applicants (if applicable)
                         .exec();

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the logged-in recruiter is the owner of the job
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not have permission to access this job" });
    }

    return res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT: Update a job post
export const updateJob = async (req, res) => {
  const { jobId } = req.params;
  const { title, description, company, location, salary, skills } = req.body;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure the logged-in recruiter owns the job before allowing updates
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not have permission to update this job" });
    }

    // Update the job fields
    job.title = title || job.title;
    job.description = description || job.description;
    job.company = company || job.company;
    job.location = location || job.location;
    job.salary = salary || job.salary;
    job.skills = skills || job.skills;

    // Save the updated job
    await job.save();
    return res.status(200).json(job); // Return the updated job
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

    // Ensure the logged-in recruiter owns the job before allowing deletion
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not have permission to delete this job" });
    }

    await Job.findByIdAndDelete(jobId); // Delete the job
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
