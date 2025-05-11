import React, { createContext, useState, useEffect } from 'react';
import JobService from '../services/jobService';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getJobs = async () => {
    setLoading(true);
    try {
      const data = await JobService.getAllJobs();
      setJobs(Array.isArray(data) ? data : data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId, token) => {
    try {
      await API.delete(`/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job.');
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <JobContext.Provider value={{ jobs, loading, getJobs, deleteJob }}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
