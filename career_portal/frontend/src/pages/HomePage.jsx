import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import JobCard from '../components/JobCard';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const HomePage = () => {
  const [jobs, setJobs] = useState([]); // Ensure jobs is initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await API.get('/jobs'); // Using API helper
        console.log(response.data); // Log the entire response to check the structure
        
        // Check if the response has a jobs array (adjust based on the actual response structure)
        if (Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs); // Assuming jobs are nested inside `data.jobs`
        } else {
          throw new Error('Expected an array of jobs inside response.data.jobs, but got ' + typeof response.data.jobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white text-center py-24 mb-10 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">Your Dream Job Awaits!</h1>
        <p className="text-xl mt-4">Explore top job opportunities and take the next step in your career.</p>
      </div>

      {/* Job Listings Section (Only for logged-in users) */}
      {user && (
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Featured Job Listings</h2>
          {loading && (
            <div className="text-center">
              <p>Loading jobs...</p> {/* You can replace this with a spinner or loading animation */}
            </div>
          )}
          {error && (
            <div className="text-center text-red-500">
              <p>Error: {error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length === 0 && !loading && !error ? (
              <p className="text-center text-gray-500">No job listings available at the moment.</p>
            ) : (
              jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))
            )}
          </div>
        </section>
      )}

      {/* Call to Action Section (Visible when user is not logged in) */}
      {!user && (
        <div className="bg-blue-100 rounded-lg py-12 mt-12 text-center shadow-xl">
          <h3 className="text-3xl font-semibold mb-6 text-gray-800">Ready to Start Your Career?</h3>
          <p className="text-lg mb-6 text-gray-700">Sign up now and gain access to exclusive job listings.</p>
          <Link
            to="/register"
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Register Now
          </Link>
        </div>
      )}

      {/* Testimonials Section */}
      <section className="mt-24 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">What Our Users Say</h2>
        <div className="flex justify-center gap-12">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
            <p className="italic text-gray-600 mb-4">"This platform helped me land my dream job! The job search experience was seamless."</p>
            <p className="font-semibold text-gray-800">John Doe</p>
            <p className="text-sm text-gray-500">Software Engineer</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm">
            <p className="italic text-gray-600 mb-4">"A fantastic way to connect with top companies. I found several opportunities I was interested in."</p>
            <p className="font-semibold text-gray-800">Jane Smith</p>
            <p className="text-sm text-gray-500">Product Manager</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
