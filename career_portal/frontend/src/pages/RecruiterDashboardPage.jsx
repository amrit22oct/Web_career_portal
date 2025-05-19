import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import StudentListModal from "../components/Modal";
import AddJobModal from "../components/AddjobModal";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/recdash.css";

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
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2>Recruiter Panel</h2>
          <nav className="flex flex-col space-y-4">
            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
              Explore Jobs
            </button>
            <button
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              onClick={() => navigate("/recruiter/myapplications")}
            >
              My Applications
            </button>
            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
              Profile
            </button>
            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
              Settings
            </button>
          </nav>
        </div>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="glass-box">
          <h1>Welcome, {recruiter?.name || "Recruiter"}!</h1>
          <p>
            You're logged in as{" "}
            {recruiter?.role
              ? recruiter.role.charAt(0).toUpperCase() + recruiter.role.slice(1)
              : "Recruiter"}
            .
          </p>
          <p>
            <strong>Email:</strong> {recruiter?.email || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {recruiter?.role || "Recruiter"}
          </p>
        </div>

        {/* Action Cards */}
        <div className="db-card">
          <div className="card-action">
            <h3>Post a Job</h3>
            <p>Quickly add new job opportunities.</p>
            <button
              onClick={() => setShowAddJobModal(true)}
              className="primary-button"
            >
              Post Now
            </button>
          </div>
          <div className="card-action">
            <h3>Applications</h3>
            <p>Manage all received applications.</p>
            <button
              onClick={() => navigate("/recruiter/myapplications")}
              className="primary-button"
            >
              View Applications
            </button>
          </div>
          <div className="card-action">
            <h3>Profile</h3>
            <p>Update your recruiter profile.</p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="glass-box">
          <h2>Dashboard Stats</h2>
          <p>Total Jobs Posted: {jobs.length}</p>
          <p>Applicants Received: 24 {/* Placeholder */}</p>
        </div>

        {/* Job Listings */}
        <div className="glass-box job-listings">
          <h2>Your Job Listings</h2>
          {loading ? (
            <p className="text-gray-400">Loading jobs...</p>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="no-jobs">
              No jobs posted yet.
              <button
                onClick={() => setShowAddJobModal(true)}
                className="primary-button"
              >
                Post a Job
              </button>
            </div>
          )}
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
