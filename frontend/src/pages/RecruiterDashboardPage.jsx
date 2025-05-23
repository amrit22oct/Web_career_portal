import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import StudentListModal from "../components/Modal";
import AddJobModal from "../components/AddjobModal";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { user: recruiter, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser().then(fetchJobs);
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API}/recruiter/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedJobs = Array.isArray(response.data)
        ? response.data
        : response.data?.jobs || [];

      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/recruiter/delete-job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-sans p-6">
      {/* Sidebar */}
      <div className="w-[17%] bg-gray-800 bg-opacity-90 p-6 flex flex-col justify-between shadow-xl border-2 border-white">
        <div>
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">Recruiter Panel</h2>
          <nav className="flex flex-col space-y-4">
            <button className="text-gray-300 hover:text-blue-400 focus:outline-none">
              Explore Jobs
            </button>
            <button
              className="text-gray-300 hover:text-blue-400 focus:outline-none"
              onClick={() => navigate("/recruiter/myapplications")}
            >
              My Applications
            </button>
            <button className="text-gray-300 hover:text-blue-400 focus:outline-none">
              Profile
            </button>
            <button className="text-gray-300 hover:text-blue-400 focus:outline-none">
              Settings
            </button>
          </nav>
        </div>
        <button
          className="text-red-300 hover:text-red-500 transition-colors"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-5 border-2 border-white p-4">
        {/* Welcome Box */}
        <div className="bg-transparent p-6 mb-8 text-white flex flex-col">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {recruiter?.name || "Recruiter"}!
          </h1>
          <p className="text-lg">
            You're logged in as{" "}
            {recruiter?.role
              ? recruiter.role.charAt(0).toUpperCase() + recruiter.role.slice(1)
              : "Recruiter"}
            .
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {recruiter?.email || "N/A"}
          </p>
          <p className="text-lg">
            <strong>Role:</strong> {recruiter?.role || "Recruiter"}
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <div className="bg-blue-500/10 backdrop-blur-lg shadow-2xl text-white p-6 border-2 border-white transition-transform hover:bg-blue-500/20 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
            <p className="mb-4">Quickly add new job opportunities.</p>
            <button
              onClick={() => setShowAddJobModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 border border-white transition"
            >
              Post Now
            </button>
          </div>
          <div className="bg-blue-500/10 backdrop-blur-lg shadow-2xl text-white p-6 border-2 border-white transition-transform hover:bg-blue-500/20 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">Applications</h3>
            <p className="mb-4">Manage all received applications.</p>
            <button
              onClick={() => navigate("/recruiter/myapplications")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 border border-white transition"
            >
              View Applications
            </button>
          </div>
          <div className="bg-blue-500/10 backdrop-blur-lg shadow-2xl text-white p-6 border-2 border-white transition-transform hover:bg-blue-500/20 hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">Profile</h3>
            <p className="mb-4">Update your recruiter profile.</p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="bg-transparent p-6 text-white border-white border-2">
          <h2 className="text-2xl font-semibold mb-2">Dashboard Stats</h2>
          <p>Total Jobs Posted: {jobs.length}</p>
          <p>Applicants Received: 24</p>
        </div>
      </div>

      {/* Modals */}
      {showStudentModal && selectedJob && (
        <StudentListModal
          job={selectedJob}
          onClose={() => setShowStudentModal(false)}
        />
      )}
      {showAddJobModal && (
        <AddJobModal
          onClose={() => setShowAddJobModal(false)}
          onJobPosted={fetchJobs}
        />
      )}
    </div>
  );
};

export default RecruiterDashboard;
