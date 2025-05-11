import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import StudentListModal from "../components/Modal";
import AddJobModal from "../components/AddjobModal";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

// ... (imports remain unchanged)

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { user: recruiter, fetchUser } = useContext(AuthContext);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API}jobs/recruiter/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const jobsData = response.data?.jobs;
      if (Array.isArray(jobsData)) {
        const filteredJobs = jobsData.filter(
          (job) => job.createdBy === recruiter._id
        );
        setJobs(filteredJobs);
      } else {
        setError("No jobs found.");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${API}jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Job deleted successfully.");
        fetchJobs();
      } catch (error) {
        alert("Failed to delete the job. Please try again.");
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchUser();
      fetchJobs();
    };
    initialize();
  }, []);

  const totalApplicants = jobs.reduce(
    (sum, job) => sum + (job.applicants?.length || 0),
    0
  );

  if (!recruiter) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <p>Loading recruiter details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between rounded-r-2xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recruiter Panel</h2>
          <nav className="space-y-4">
            {["Explore Jobs", "Profile", "Settings"].map((item, index) => (
              <button
                key={index}
                className="text-gray-700 hover:text-blue-600 w-full text-left"
                onClick={() => console.log(`${item} clicked`)}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <button
          className="text-red-600 hover:text-red-800 w-full text-left mt-6"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {recruiter.name}!
          </h1>
          <p className="text-lg text-gray-500 mt-1">
            You're logged in as a{" "}
            {recruiter.role
              ? recruiter.role.charAt(0).toUpperCase() + recruiter.role.slice(1)
              : "Recruiter"}.
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-blue-500">
              <span className="font-semibold text-gray-400">Email:</span>{" "}
              {recruiter.email}
            </p>
            <p className="text-green-500">
              <span className="font-semibold text-gray-700">Role:</span>{" "}
              {recruiter.role}
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow hover:bg-blue-700">
            <h3 className="text-xl font-semibold">Explore Jobs</h3>
            <p>Browse and post job openings.</p>
            <button
              onClick={() => setShowAddJobModal(true)}
              className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-blue-100"
            >
              Post a Job
            </button>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-2xl shadow hover:bg-green-700">
            <h3 className="text-xl font-semibold">Profile</h3>
            <p>Update your personal information.</p>
          </div>
          <div className="bg-gray-600 text-white p-6 rounded-2xl shadow hover:bg-gray-700">
            <h3 className="text-xl font-semibold">Settings</h3>
            <p>Manage your account settings.</p>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Analytics</h2>
          <p className="text-gray-600">Total Jobs Posted: {jobs.length}</p>
          <p className="text-gray-600">Applicants Received: {totalApplicants}</p>
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

