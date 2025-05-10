import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import StudentListModal from "../components/Modal";
import AddJobModal from "../components/AddjobModal";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { user: recruiter, fetchUser } = useContext(AuthContext);

  const fetchJobs = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API}jobs/recruiter/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(response.data?.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const initialize = async () => {
      await fetchUser();  // Ensure recruiter data is fetched
      fetchJobs();        // Then fetch jobs
    };
    initialize();
  }, [fetchUser]);  // Dependency on fetchUser to re-fetch if needed

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between rounded-r-2xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recruiter Panel</h2>
          <nav className="space-y-4">
            {["Explore Jobs", "My Applications", "Profile", "Settings"].map((item, index) => (
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
            Welcome, {recruiter?.name || "Loading..."}!
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            You're logged in as a{" "}
            {recruiter?.role
              ? recruiter.role.charAt(0).toUpperCase() + recruiter.role.slice(1)
              : "Recruiter"}.
          </p>
          <div className="mt-4 space-y-2">
            <p>
              <span className="font-semibold text-gray-700">Email:</span>{" "}
              {recruiter?.email || "Loading..."}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Role:</span>{" "}
              {recruiter?.role || "Loading..."}
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
          <div className="bg-purple-600 text-white p-6 rounded-2xl shadow hover:bg-purple-700">
            <h3 className="text-xl font-semibold">My Applications</h3>
            <p>Manage received applications.</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-2xl shadow hover:bg-green-700">
            <h3 className="text-xl font-semibold">Profile</h3>
            <p>Update your personal information.</p>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Analytics</h2>
          <p className="text-gray-600">Total Jobs Posted: {jobs.length}</p>
          <p className="text-gray-600">Applicants Received: 24</p>
          <p className="text-gray-600">Interviews Scheduled: 8</p>
        </div>

        {/* Posted Jobs */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Posted Jobs</h2>
          {loading ? (
            <p className="text-gray-600">Loading jobs...</p>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onViewApplicants={() => {
                    setSelectedJob(job);
                    setShowStudentModal(true);
                  }}
                  // onDelete={() => handleDeleteJob(job._id)} // ❌ Removed delete
                />
              ))}
            </div>
          ) : (
            <div>
              <p className="text-gray-600">No jobs posted yet.</p>
              <button
                onClick={() => setShowAddJobModal(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700"
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
          onJobPosted={fetchJobs} // Ensure jobs list is refreshed after posting a job
        />
      )}
    </div>
  );
};

export default RecruiterDashboard;
