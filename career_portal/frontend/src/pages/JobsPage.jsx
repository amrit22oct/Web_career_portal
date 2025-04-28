import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock job data (no API call, static data)
  useEffect(() => {
    const fetchJobs = () => {
      try {
        setLoading(true);
        // Mock job data
        const fetchedJobs = [
          {
            id: '1',
            title: 'Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            salary: '$120,000/year',
            description:
              'Join our dynamic team as a Software Engineer where you will work on building cutting-edge web applications.',
            jobType: 'Full-Time',
          },
          {
            id: '2',
            title: 'Product Manager',
            company: 'Innovative Inc.',
            location: 'Los Angeles, CA',
            salary: '$110,000/year',
            description:
              'We are looking for a skilled Product Manager to drive product development and enhance user experiences.',
            jobType: 'Full-Time',
          },
          {
            id: '3',
            title: 'UI/UX Designer',
            company: 'Creative Studios',
            location: 'New York, NY',
            salary: '$95,000/year',
            description:
              'Creative Studios is looking for a talented UI/UX Designer to join our design team and create stunning user interfaces.',
            jobType: 'Part-Time',
          },
        ];
        setJobs(fetchedJobs);
      } catch (err) {
        setError('Error fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="jobs-page-container p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Available Job Listings</h1>
      <div className="job-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
