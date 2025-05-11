import API from './api';

// Helper function to handle errors
const handleError = (error) => {
  if (error.response && error.response.data) {
    throw error.response.data;
  } else {
    throw { message: error.message || 'An unknown error occurred' };
  }
};

const JobService = {
  // Get all public jobs
  getAllJobs: async () => {
    try {
      const response = await API.get('/jobs');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get a single job by ID and return all job data
  getJobById: async (jobId) => {
    try {
      const response = await API.get(`/jobs/${jobId}`);  // Corrected URL
      return response.data; // Ensure this contains all job-related data (e.g., recruiter, salary, description, etc.)
    } catch (error) {
      handleError(error);
    }
  },

  // Create a new job post (for recruiters)
  createJob: async (jobData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.post('/jobs', jobData, {
        headers: { Authorization: `Bearer ${token}` },  // Corrected Bearer token interpolation
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Apply to a job (for students)
  applyToJob: async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.post(`/jobs/${jobId}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` },  // Corrected Bearer token interpolation
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get jobs created by the recruiter
  getRecruiterJobs: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/jobs/recruiter/jobs', {
        headers: { Authorization: `Bearer ${token}` },  // Corrected Bearer token interpolation
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
};

export default JobService;
