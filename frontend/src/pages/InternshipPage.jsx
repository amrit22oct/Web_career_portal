import React, { useState, useEffect } from 'react';
import JobService from '../services/jobService';
import JobCard from '../components/JobCard';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center my-10">
    <div className="w-16 h-16 border-4 border-gray-700 border-t-blue-400 rounded-full animate-spin"></div>
  </div>
);

const InternshipPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInternships = async () => {
    try {
      const response = await JobService.getInternshipJobs();
      if (response && Array.isArray(response.data)) {
        setInternships(response.data);
      } else {
        setError('Failed to fetch internships');
      }
    } catch (err) {
      setError('Error fetching internships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 px-4 sm:px-6 md:px-10 py-10">
  <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8">
    Internship Opportunities
  </h1>

  {loading && <LoadingSpinner />}

  {error && (
    <div className="text-center bg-red-700 text-red-100 p-4 rounded mb-6 max-w-xl mx-auto">
      {error}
    </div>
  )}

  {!loading && !error && internships.length === 0 && (
    <div className="text-center bg-yellow-600 text-yellow-100 p-4 rounded mb-6 max-w-xl mx-auto">
      No internships available at the moment.
    </div>
  )}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {internships.map((job) => (
      <div key={job._id} className="bg-gray-800 p-5 rounded-lg shadow-md">
        <JobCard job={job} />
      </div>
    ))}
  </div>
</div>

  );
};

export default InternshipPage;
