import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import JobCard from '../components/JobCard';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import '@/styles/homePage.css';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const images = [
    img1,
    img2,
    img3,
    img4,
    img5
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await API.get('/jobs');
        if (Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="home-container">
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease-in-out'
        }}
      >
        <h1>Your Dream Awaits!</h1>
        <p>Explore top job opportunities and take the next step in your career.</p>
      </div>

      {user && (
        <section className="job-section">
          <h2>Featured Job Listings</h2>

          {loading && <p className="center-text">Loading..</p>}
          {error && <p className="center-text error-text">Error: {error}</p>}

          {jobs.length === 0 && !loading && !error ? (
            <p className="center-text no-jobs">No job listings available at the moment.</p>
          ) : (
            <>
              <div className="job-grid">
                {jobs.slice(0, 3).map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
              {jobs.length > 3 && (
                <div className="center-text">
                  <Link to="/jobs" className="view-more-btn">View More Jobs</Link>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {!user && (
        <div className="cta-box">
          <h3>Ready to Start Your Career?</h3>
          <p>Sign up now and gain access to exclusive job listings.</p>
          <Link to="/register" className="register-btn">Register Now</Link>
        </div>
      )}

      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-wrapper">
          <div className="testimonial-card">
            <p>"This platform helped me land my dream job! The job search experience was seamless."</p>
            <strong>John Doe</strong>
            <span>Software Engineer</span>
          </div>
          <div className="testimonial-card">
            <p>"A fantastic way to connect with top companies. I found several opportunities I was interested in."</p>
            <strong>Jane Smith</strong>
            <span>Product Manager</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
