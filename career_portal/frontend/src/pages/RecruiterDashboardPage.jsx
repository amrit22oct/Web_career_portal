import React, { useState, useEffect } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import StudentListModal from "../components/Modal";
import AddJobModal from "../components/AddjobModal"; // Corrected the import

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Fetch jobs data when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs");
        console.log(response.data); // Log the response to check its structure
        
        // Ensure we are setting the jobs as an array
        setJobs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]); // Set jobs to an empty array on error
      }
    };

    fetchJobs();
  }, []);

  const user = {
    name: "Recruiter",
    email: "recruiter@example.com",
    role: "recruiter",
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between rounded-r-2xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recruiter Panel</h2>
          <nav className="space-y-4">
            <button className="text-gray-700 hover:text-blue-600 w-full text-left">Explore Jobs</button>
            <button className="text-gray-700 hover:text-blue-600 w-full text-left">My Applications</button>
            <button className="text-gray-700 hover:text-blue-600 w-full text-left">Profile</button>
            <button className="text-gray-700 hover:text-blue-600 w-full text-left">Settings</button>
          </nav>
        </div>
        <button className="text-red-600 hover:text-red-800 w-full text-left mt-6">Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Welcome */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}!</h1>
          <p className="text-lg text-gray-600 mt-1">
            You're logged in as a {user.role.charAt(0).toUpperCase() + user.role.slice(1)}.
          </p>
          <div className="mt-4 space-y-2">
            <p><span className="font-semibold text-gray-700">Email:</span> {user.email}</p>
            <p><span className="font-semibold text-gray-700">Role:</span> {user.role}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(jobs) && jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onViewApplicants={() => {
                    setSelectedJob(job);
                    setShowStudentModal(true);
                  }}
                  onDelete={() => {}}
                />
              ))
            ) : (
              <p className="text-gray-600">No jobs posted yet.</p>
            )}
          </div>
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
          onJobPosted={() => {
            // Optional: Refetch the jobs after posting a new job
            fetchJobs();
          }}
        />
      )}
    </div>
  );
};

export default RecruiterDashboard;
