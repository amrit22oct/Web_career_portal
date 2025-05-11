import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import JobService from '../services/jobService';
import JobCard from '../components/JobCard';

const JobsPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const JOBS_PER_PAGE = 10;

  const getJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user || !user.role) throw new Error('User not authenticated or missing role');

      // Recruiter-specific jobs
      if (user.role === 'recruiter') {
        const recruiterJobs = await JobService.getRecruiterJobs();
        setMyJobs(Array.isArray(recruiterJobs) ? recruiterJobs : recruiterJobs.jobs || []);
      }

      // Initial public jobs
      const publicJobs = await JobService.getAllJobs(1);
      const jobList = Array.isArray(publicJobs) ? publicJobs : publicJobs.jobs || [];
      setJobs(jobList.slice(0, JOBS_PER_PAGE));
      setPage(1);
      setHasMore(jobList.length >= JOBS_PER_PAGE);
    } catch (err) {
      setError('Unable to fetch job listings.');
      console.error('Job fetching error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreJobs = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const newJobsData = await JobService.getAllJobs(nextPage);
      const newJobs = Array.isArray(newJobsData) ? newJobsData : newJobsData.jobs || [];

      // Filter out duplicates
      const existingJobIds = new Set(jobs.map((job) => job._id || job.id));
      const uniqueNewJobs = newJobs.filter((job) => !existingJobIds.has(job._id || job.id));

      setJobs((prevJobs) => [...prevJobs, ...uniqueNewJobs]);
      setPage(nextPage);

      if (uniqueNewJobs.length < JOBS_PER_PAGE) setHasMore(false);
    } catch (err) {
      setError('Error loading more jobs.');
      console.error('Error loading more jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) getJobs();
  }, [authLoading, user]);

  if (loading && jobs.length === 0) {
    return (
      <div className="p-6 text-lg text-center">
        <div className="spinner-border animate-spin text-blue-500" role="status" />
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="jobs-page-container p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>

      {user?.role === 'recruiter' && (
        <>
          <h2 className="text-2xl font-semibold mb-4">Your Posted Jobs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {myJobs.length > 0 ? (
              myJobs.map((job) => <JobCard key={job._id || job.id} job={job} />)
            ) : (
              <div className="text-gray-500">You haven't posted any jobs yet.</div>
            )}
          </div>
        </>
      )}

      <h2 className="text-2xl font-semibold mb-4">All Public Job Listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => <JobCard key={job._id || job.id} job={job} />)
        ) : (
          <div className="text-gray-500">No jobs available.</div>
        )}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMoreJobs}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Load More Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
