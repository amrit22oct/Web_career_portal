import React, { useState, useEffect } from 'react';
import JobService from '../services/jobService'; // Ensure you have the correct path for jobService
import JobCard from '../components/JobCard'; // Import your JobCard component

// Tailwind-based Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-16 h-16 border-4 border-t-4 border-gray-300 rounded-full animate-spin border-t-blue-500"></div>
  </div>
);

// InternshipPage Component
const InternshipPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch internships from the service
  const fetchInternships = async () => {
    try {
      const response = await JobService.getInternshipJobs();
      console.log('Fetched internships:', response);

      if (response && Array.isArray(response.data)) {
        setInternships(response.data); // Set internships data
      } else {
        console.error('Data is not in the expected format');
        setError('Failed to fetch internships');
      }
    } catch (err) {
      console.error('Error fetching internships:', err);
      setError('Error fetching internships');
    } finally {
      setLoading(false); // Set loading to false when fetching is complete
    }
  };

  useEffect(() => {
    fetchInternships(); // Fetch internships on page load
  }, []);

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">Internship Opportunities</h1>

      {/* Show loading spinner if data is still being fetched */}
      {loading && <LoadingSpinner />}

      {/* Show error message if there is an error */}
      {error && (
        <div className="text-center text-red-600 bg-red-200 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Show no internships message if there are no internships */}
      {internships.length === 0 && !loading && !error && (
        <div className="text-center text-gray-700 bg-yellow-100 p-4 rounded-md mb-6">
          No internships available at the moment.
        </div>
      )}

      {/* Display the internships if there is data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {internships.map((job) => (
          <div key={job._id} className="shadow-lg rounded-lg bg-white p-6">
            <JobCard job={job} /> {/* Use your JobCard component */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternshipPage;
