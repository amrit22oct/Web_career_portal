import { useContext } from 'react';
import JobContext from '../context/JobContext';
import JobCard from '../components/JobCard';

const JobsPage = () => {
  const { jobs, loading, error } = useContext(JobContext);

  if (loading) return <div className="p-6 text-lg">Loading jobs...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error.message || error}</div>;

  return (
    <div className="jobs-page-container p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Available Job Listings</h1>
      <div className="job-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(jobs) && jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job._id || job.id} job={job} />)
        ) : (
          <div className="text-gray-500">No jobs available.</div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
