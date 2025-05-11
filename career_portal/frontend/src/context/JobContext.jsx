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
    setJobsPage(nextPage);
    fetchPublicJobs(nextPage);
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
      const newJob = await JobService.createJob(jobData);
      setMyJobs((prev) => [...prev, newJob]);
    } catch (err) {
      setError(err.message || 'Failed to create job');
      console.error('Error creating job:', err);
    }
  };

  const applyToJob = async (jobId) => {
    try {
      await JobService.applyToJob(jobId);
      alert('Successfully applied for the job!');
    } catch (err) {
      setError(err.message || 'Failed to apply for job');
      console.error('Error applying to job:', err);
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        myJobs,
        loading,
        error,
        createJob,
        applyToJob,
        refetchJobs: () => fetchPublicJobs(1),
        loadMoreJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
