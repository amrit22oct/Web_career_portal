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
  // Get all jobs
  getAllJobs: async () => {
    try {
      const response = await API.get('/jobs');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Get a single job by ID
  getJobById: async (jobId) => {
    try {
      const response = await API.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Create a new job post (for recruiters)
  createJob: async (jobData) => {
    try {
      const response = await API.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Apply to a job (for students)
  applyToJob: async (jobId) => {
    try {
      const response = await API.post(`/jobs/${jobId}/apply`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default JobService;
