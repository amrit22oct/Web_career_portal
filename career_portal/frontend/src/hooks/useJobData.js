import { useState, useEffect } from 'react';
import JobService from '../services/jobService'; // make sure path is correct

const useJobData = () => {
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchJobs = async () => {
      try {
        const publicJobs = await JobService.getAllJobs();
        setJobs(Array.isArray(publicJobs) ? publicJobs : publicJobs.jobs || []);

        const token = localStorage.getItem('token');
        if (token) {
          const recruiterJobs = await JobService.getRecruiterJobs();
          setMyJobs(Array.isArray(recruiterJobs) ? recruiterJobs : recruiterJobs.jobs || []);
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.message || 'Failed to load jobs');
          console.error('Error fetching jobs:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    return () => controller.abort();
  }, []);

  return { jobs, myJobs, loading, error };
};

export default useJobData;
