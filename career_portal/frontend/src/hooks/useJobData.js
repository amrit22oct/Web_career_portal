import { useState, useEffect } from 'react';
import API from '../services/api';

const useJobData = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // NEW: Track errors if needed

  useEffect(() => {
    let isMounted = true; // NEW: Prevent setting state if component unmounts during fetch

    const fetchJobs = async () => {
      try {
        const response = await API.get('/jobs');
        if (isMounted) {
          setJobs(response.data);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        if (isMounted) {
          setError(err.response ? err.response.data : err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      isMounted = false; // Clean up to avoid memory leaks
    };
  }, []);

  return { jobs, loading, error };
};

export default useJobData;
