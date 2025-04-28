import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const RecruiterDashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login', { replace: true });
          return;
        }

        const { data } = await API.get('/recruiter/my-jobs', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        if (err.response?.status === 401) {
          navigate('/login', { replace: true });
        } else {
          setError(err.response?.data?.message || 'Failed to fetch jobs. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [navigate]);

  const totalApplicants = jobs.reduce((acc, job) => acc + (job.applicants?.length || 0), 0);
  const activeJobs = jobs.filter(job => job.status === 'active').length;

  return (
    <div className="p-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 min-h-screen text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-center">Recruiter Dashboard</h1>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <StatCard title="Total Jobs Posted" value={jobs.length} />
        <StatCard title="Active Listings" value={activeJobs} />
        <StatCard title="Applicants" value={totalApplicants} />
      </div>

      {/* Loading & Error */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="ml-4">Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-200">No jobs available. Post your first job!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} navigate={navigate} />
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => navigate('/recruiter/create-job')}
          className="bg-teal-600 text-white rounded-full p-4 shadow-lg hover:bg-teal-700 transition duration-300"
        >
          <FaPlus className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

// Small Reusable Components
const StatCard = ({ title, value }) => (
  <div className="bg-white text-gray-800 p-6 rounded-xl shadow-lg w-72 text-center hover:scale-105 transform transition-all duration-300 ease-in-out">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const JobCard = ({ job, navigate }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-transform transform hover:scale-105">
    <h2 className="text-2xl font-bold text-indigo-600">{job.title}</h2>
    <p className="text-gray-700 mt-2">{job.company}</p>
    <p className="text-gray-500 mt-1">{job.location}</p>
    <p className="text-gray-600 mt-4">{job.description.slice(0, 100)}...</p>

    <div className="mt-4 flex justify-between items-center">
      <button
        onClick={() => navigate(`/jobs/${job._id}`)}
        className="text-blue-500 hover:underline"
      >
        View Details
      </button>
      <div className="flex gap-4">
        <button
          onClick={() => navigate(`/recruiter/edit-job/${job._id}`)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
        >
          <FaEdit className="inline-block mr-2" /> Edit
        </button>
        <button
          onClick={() => navigate(`/recruiter/delete-job/${job._id}`)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          <FaTrash className="inline-block mr-2" /> Delete
        </button>
      </div>
    </div>
  </div>
);

export default RecruiterDashboardPage;
