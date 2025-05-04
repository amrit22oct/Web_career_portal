import { createContext } from 'react';
import useJobData from '../hooks/useJobData';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const { jobs, loading, error } = useJobData();

  return (
    <JobContext.Provider value={{ jobs, loading, error }}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
