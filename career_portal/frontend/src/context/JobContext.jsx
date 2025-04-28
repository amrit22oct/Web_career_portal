import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get('/jobs');
        setJobs(data);
      } catch (error) {
        console.error('JobContext error:', error);
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <JobContext.Provider value={{ jobs, loading, error }}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
