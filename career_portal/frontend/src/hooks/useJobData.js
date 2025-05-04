import { useState, useEffect } from 'react';
import API from '../services/api';

const useJobData = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        const response = await API.get('/jobs/');
        const jobData = Array.isArray(response.data)
          ? response.data
          : response.data.jobs || [];

        if (isMounted) {
          setJobs(jobData);
          console.table(jobData); // Helpful for debugging
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response ? err.response.data : err.message);
          console.error('Error fetching jobs:', err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  return { jobs, loading, error };
};

export default useJobData;
