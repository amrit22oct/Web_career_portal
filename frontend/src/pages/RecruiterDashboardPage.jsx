import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import StudentListModal from "../components/Modal";
import AddJobModal from "../components/AddjobModal";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const sidebarLinks = [
  {
    name: "Explore Jobs",
    icon: BriefcaseIcon,
    onClick: () => {}, // Add navigate or other handlers
  },
  {
    name: "My Applications",
    icon: ClipboardDocumentListIcon,
    onClick: null, // will navigate
  },
  {
    name: "Profile",
    icon: UserCircleIcon,
    onClick: () => {}, // Add handler
  },
  {
    name: "Settings",
    icon: Cog6ToothIcon,
    onClick: () => {}, // Add handler
  },
];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white font-sans">
      <div className="flex min-h-screen">
        {/* Sidebar (hidden on tablet & mobile, visible on lg+) */}
        <aside
          className="
            hidden
            lg:flex
            h-auto
            w-60
            bg-gradient-to-tr from-blue-900 via-indigo-900 to-purple-900
            shadow-xl 
            flex-col justify-between
            p-6
            text-gray-300
          "
        >
          {/* Logo */}
          <div className="mb-8 flex items-center justify-start">
            <div className="text-white font-extrabold text-2xl tracking-widest">
              RECRUITER
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-6 flex-grow">
            {sidebarLinks.map(({ name, icon: Icon, onClick }, i) => (
              <button
                key={i}
                onClick={
                  onClick
                    ? onClick
                    : () => {
                        if (name === "My Applications")
                          navigate("/recruiter/myapplications");
                      }
                }
                className="
                  flex items-center gap-4 
                  px-3 py-2 rounded-lg 
                  hover:bg-indigo-700 hover:text-white 
                  transition-colors duration-300
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                "
                title={name}
                aria-label={name}
              >
                <Icon className="h-6 w-6" />
                <span className="font-semibold text-lg">{name}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
            className="
              mt-6 flex items-center gap-4 
              px-3 py-2 rounded-lg 
              text-red-400 hover:bg-red-700 hover:text-red-200 
              transition-colors duration-300
              focus:outline-none focus:ring-2 focus:ring-red-500
            "
            title="Logout"
            aria-label="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <span className="font-semibold text-lg">Logout</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto min-h-screen">
          {/* Welcome Box */}
          <section className="mb-10">
            <h1 className="text-4xl font-extrabold mb-2 text-white">
              Welcome, {recruiter?.name || "Recruiter"}!
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              You're logged in as{" "}
              <span className="font-semibold text-indigo-300">
                {recruiter?.role
                  ? recruiter.role.charAt(0).toUpperCase() + recruiter.role.slice(1)
                  : "Recruiter"}
              </span>
              .
            </p>
            <p className="text-gray-400 mt-1">
              <strong>Email:</strong> {recruiter?.email || "N/A"}
            </p>
            <p className="text-gray-400">
              <strong>Role:</strong> {recruiter?.role || "Recruiter"}
            </p>
          </section>

          {/* Action Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-indigo-800/80 backdrop-blur-lg shadow-lg text-white p-6 rounded-xl border border-indigo-600 hover:shadow-indigo-500 transition transform hover:-translate-y-1 hover:scale-[1.02]">
              <h3 className="text-2xl font-semibold mb-3">Post a Job</h3>
              <p className="mb-5 text-indigo-300">Quickly add new job opportunities.</p>
              <button
                onClick={() => setShowAddJobModal(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-md shadow-md transition"
              >
                Post Now
              </button>
            </div>
            <div className="bg-indigo-800/80 backdrop-blur-lg shadow-lg text-white p-6 rounded-xl border border-indigo-600 hover:shadow-indigo-500 transition transform hover:-translate-y-1 hover:scale-[1.02]">
              <h3 className="text-2xl font-semibold mb-3">Applications</h3>
              <p className="mb-5 text-indigo-300">Manage all received applications.</p>
              <button
                onClick={() => navigate("/recruiter/myapplications")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-md shadow-md transition"
              >
                View Applications
              </button>
            </div>
            <div className="bg-indigo-800/80 backdrop-blur-lg shadow-lg text-white p-6 rounded-xl border border-indigo-600 hover:shadow-indigo-500 transition transform hover:-translate-y-1 hover:scale-[1.02]">
              <h3 className="text-2xl font-semibold mb-3">Profile</h3>
              <p className="mb-5 text-indigo-300">Update your recruiter profile.</p>
            </div>
          </section>

          {/* Dashboard Stats */}
          <section className="bg-indigo-900/70 p-6 rounded-xl border border-indigo-700 text-white max-w-md">
            <h2 className="text-3xl font-bold mb-4">Dashboard Stats</h2>
            <p className="mb-2">
              Total Jobs Posted: <span className="font-semibold">{jobs.length}</span>
            </p>
            <p>
              Applicants Received: <span className="font-semibold">24</span>
            </p>
          </section>
        </main>
      </div>

      {/* Modals */}
      {showStudentModal && selectedJob && (
        <StudentListModal job={selectedJob} onClose={() => setShowStudentModal(false)} />
      )}
      {showAddJobModal && (
        <AddJobModal onClose={() => setShowAddJobModal(false)} onJobPosted={fetchJobs} />
      )}
    </div>
  );
};

export default RecruiterDashboard;
