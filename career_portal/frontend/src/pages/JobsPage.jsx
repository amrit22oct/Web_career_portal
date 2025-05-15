import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import JobService from '../services/jobService';
import JobCard from '../components/JobCard';
import '../styles/jobpage.css';

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
      <div className="loading-container">
        <div className="spinner" />
        <p className="loading-text">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        <h1 className="main-heading">Explore Career Opportunities</h1>

        {user?.role === 'recruiter' && (
          <>
            <h2 className="section-heading green">Your Posted Jobs</h2>
            <div className="jobs-grid">
              {visibleMyJobs.length > 0 ? (
                visibleMyJobs.map((job) => <JobCard key={job._id || job.id} job={job} />)
              ) : (
                <div className="no-jobs-msg">You haven't posted any jobs yet.</div>
              )}
            </div>
            {hasMoreMyJobs && (
              <div className="button-wrapper">
                <button onClick={loadMoreMyJobs} className="load-more-btn green">
                  Load More of Your Jobs
                </button>
              </div>
            )}
          </>
        )}

        <h2 className="section-heading blue">All Public Job Listings</h2>
        <div className="jobs-grid">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id || job.id} job={job} />)
          ) : (
            <div className="no-jobs-msg">No jobs available right now.</div>
          )}
        </div>

        {hasMore && (
          <div className="button-wrapper">
            <button onClick={loadMoreJobs} className="load-more-btn blue">
              Load More Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
