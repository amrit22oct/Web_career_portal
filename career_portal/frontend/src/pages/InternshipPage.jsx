import React, { useState, useEffect } from 'react';
import JobService from '../services/jobService';
import JobCard from '../components/JobCard';
import '../styles/internship.css'; // Import the separated CSS

const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
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
    <div className="internship-page">
      <h1 className="internship-heading">Internship Opportunities</h1>

      {loading && <LoadingSpinner />}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && internships.length === 0 && (
        <div className="no-internships-message">No internships available at the moment.</div>
      )}

      <div className="internship-grid">
        {internships.map((job) => (
          <div key={job._id} className="job-card-wrapper">
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InternshipPage;
