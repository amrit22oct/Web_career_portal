import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import JobService from '../services/jobService';
import JobCard from '../components/JobCard';

const JobsPage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [visibleMyJobs, setVisibleMyJobs] = useState([]);
  const [myPage, setMyPage] = useState(1);
  const [page, setPage] = useState(1);
  const [hasMoreMyJobs, setHasMoreMyJobs] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const JOBS_PER_PAGE = 9;
  const MY_JOBS_PER_PAGE = 3;

  const getJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // Always fetch public jobs
      const publicJobs = await JobService.getAllJobs(1);
      const jobList = Array.isArray(publicJobs) ? publicJobs : publicJobs.jobs || [];
      setJobs(jobList.slice(0, JOBS_PER_PAGE));
      setPage(1);
      setHasMore(jobList.length >= JOBS_PER_PAGE);

      // If recruiter, fetch their posted jobs
      if (user?.role === 'recruiter') {
        const recruiterJobs = await JobService.getRecruiterJobs();
        const recruiterJobsList = Array.isArray(recruiterJobs) ? recruiterJobs : recruiterJobs.jobs || [];
        setMyJobs(recruiterJobsList);
        setVisibleMyJobs(recruiterJobsList.slice(0, MY_JOBS_PER_PAGE));
        setHasMoreMyJobs(recruiterJobsList.length > MY_JOBS_PER_PAGE);
        setMyPage(1);
      }} catch (err) {
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

  const loadMoreMyJobs = () => {
    const nextPage = myPage + 1;
    const nextJobs = myJobs.slice(0, nextPage * MY_JOBS_PER_PAGE);
    setVisibleMyJobs(nextJobs);
    setMyPage(nextPage);
    if (nextJobs.length >= myJobs.length) setHasMoreMyJobs(false);
  };

  useEffect(() => {
    if (!authLoading) getJobs();
  }, [authLoading]);

  if (loading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4" />
        <p className="text-lg font-medium text-blue-600">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-blue-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">Explore Career Opportunities</h1>

        {user?.role === 'recruiter' && (
          <>
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Your Posted Jobs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {visibleMyJobs.length > 0 ? (
                visibleMyJobs.map((job) => <JobCard key={job._id || job.id} job={job} />)
              ) : (
                <div className="col-span-full text-gray-500 text-center italic">You haven't posted any jobs yet.</div>
              )}
            </div>
            {hasMoreMyJobs && (
              <div className="text-center mb-10">
                <button
                  onClick={loadMoreMyJobs}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-full shadow-lg transition-all"
                >
                  Load More of Your Jobs
                </button>
              </div>
            )}
          </>
        )}

        <h2 className="text-2xl font-semibold text-blue-800 mb-4 mt-6">All Public Job Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id || job.id} job={job} />)
          ) : (
            <div className="col-span-full text-gray-500 text-center italic">No jobs available right now.</div>
          )}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMoreJobs}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full shadow-md transition-all"
            >
              Load More Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
