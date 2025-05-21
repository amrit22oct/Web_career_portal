import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import JobCard from '../components/JobCard';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';

const placements = [
  { student: 'Alice Johnson', job: 'Software Developer', salary: '$85,000' },
  { student: 'Bob Williams', job: 'Data Scientist', salary: '$95,000' },
  { student: 'Clara Lee', job: 'Product Manager', salary: '$90,000' },
  { student: 'David Kim', job: 'UX Designer', salary: '$80,000' },
  { student: 'Eva Brown', job: 'DevOps Engineer', salary: '$92,000' }
];

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const images = [img1, img2, img3, img4, img5];
  const [heroIndex, setHeroIndex] = useState(0);
  const [placementIndex, setPlacementIndex] = useState(0);

  useEffect(() => {
    API.get('/jobs')
      .then(res => setJobs(res.data.jobs || []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlacementIndex((i) => (i + 1) % placements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const prevPlacement = () => setPlacementIndex(i => (i - 1 + placements.length) % placements.length);
  const nextPlacement = () => setPlacementIndex(i => (i + 1) % placements.length);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Banner */}
      <div className="relative h-96 overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={heroIndex}
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${images[heroIndex]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your Dream Awaits
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Explore top job opportunities and take the next step in your career.
          </motion.p>
        </div>
      </div>

      {/* Featured Jobs */}
      {user && (
        <section className="py-16 px-8">
          <h2 className="text-4xl font-semibold text-center mb-12 relative after:w-32 after:h-1 after:bg-teal-400 after:block after:mx-auto after:mt-4">
            Featured Jobs
          </h2>
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.slice(0, 6).map(job => (
                <div
                  key={job._id}
                  className="bg-gray-800 p-6 rounded shadow-md"
                >
                  <JobCard job={job} className="hover:shadow-2xl transition-shadow duration-300" />
                </div>
              ))}
            </div>
          )}
          {jobs.length > 6 && (
            <div className="text-center mt-10">
              <Link
                to="/jobs"
                className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Browse All Jobs
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Placement Carousel */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600">
        <h3 className="text-3xl font-bold text-center mb-8 text-white">Recent Placements</h3>
        <div className="relative max-w-xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-8 flex items-center justify-between">
          <button onClick={prevPlacement} className="text-white text-2xl p-2 hover:text-teal-300">
            <FaChevronLeft />
          </button>
          <div className="text-center px-4">
            <p className="text-xl">{placements[placementIndex].student}</p>
            <p className="text-2xl font-semibold mt-2">{placements[placementIndex].job}</p>
            <p className="mt-1 text-lg">Salary: <span className="font-bold">{placements[placementIndex].salary}</span></p>
          </div>
          <button onClick={nextPlacement} className="text-white text-2xl p-2 hover:text-teal-300">
            <FaChevronRight />
          </button>
        </div>
      </section>

      {/* Footer CTA */}
      <div className="mt-auto bg-gray-900 py-6 text-center">
        <p className="mb-2">Ready to take the next step?</p>
        <Link
          to={user ? '/jobs' : '/register'}
          className="inline-block bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          {user ? 'View Jobs' : 'Sign Up'}
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
