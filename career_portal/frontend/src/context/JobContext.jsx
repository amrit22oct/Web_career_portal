import React, { createContext, useState, useEffect, useContext } from 'react';
import JobService from '../services/jobService';
import { AuthContext } from './AuthContext';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [jobsPage, setJobsPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [jobActionLoading, setJobActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recruiter’s own jobs
  const fetchMyJobs = async () => {
    try {
      const data = await JobService.getRecruiterJobs();
      setMyJobs(Array.isArray(data) ? data : data.jobs || []);
    } catch (err) {
      console.error('Error fetching recruiter jobs:', err);
    }
  };

  // Fetch public jobs (all users)
  const fetchPublicJobs = async (page = 1) => {
    try {
      const data = await JobService.getAllJobs(page);
      const fetchedJobs = Array.isArray(data) ? data : data.jobs || [];

      if (page === 1) {
        setJobs(fetchedJobs);
      } else {
        setJobs((prev) => [...prev, ...fetchedJobs]);
      }
    } catch (err) {
      setError('Unable to fetch public jobs');
      console.error('Error fetching public jobs:', err);
    }
  };

  const loadMoreJobs = () => {
    const nextPage = jobsPage + 1;
    fetchPublicJobs(nextPage);
    setJobsPage(nextPage);
  };

  useEffect(() => {
    if (!authLoading && user) {
      setLoading(true);
      fetchPublicJobs(1).then(() => setLoading(false));

      if (user.role === 'recruiter') {
        fetchMyJobs();
      }
    } else if (!user) {
      setJobs([]);
      setMyJobs([]);
      setLoading(false);
    }
  }, [authLoading, user]);

  const createJob = async (jobData) => {
    try {
      setJobActionLoading(true);
      const newJob = await JobService.createJob(jobData);
      setMyJobs((prev) => [...prev, newJob]);
    } catch (err) {
      setError(err.message || 'Failed to create job');
      console.error('Error creating job:', err);
    } finally {
      setJobActionLoading(false);
    }
  };

  const applyToJob = async (jobId) => {
    try {
      setJobActionLoading(true);
      await JobService.applyToJob(jobId);
      alert('Successfully applied for the job!');
    } catch (err) {
      setError(err.message || 'Failed to apply for job');
      console.error('Error applying to job:', err);
    } finally {
      setJobActionLoading(false);
    }
  };

  const clearError = () => setError(null);

  const getJobById = async (id) => {
    try {
      return await JobService.getJobById(id);
    } catch (err) {
      setError(err.message || 'Failed to fetch job details');
      console.error('Error fetching job by ID:', err);
    }
  };

  const getInternshipJobs = async () => {
    try {
      return await JobService.getInternshipJobs();
    } catch (err) {
      setError(err.message || 'Failed to fetch internship jobs');
      console.error('Error fetching internship jobs:', err);
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        myJobs,
        loading,
        error,
        jobActionLoading,
        createJob,
        applyToJob,
        refetchJobs: () => fetchPublicJobs(1),
        loadMoreJobs,
        clearError,
        getJobById,
        getInternshipJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
