import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import {
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const sidebarLinks = [
  {
    name: "Explore Jobs",
    icon: BriefcaseIcon,
    path: "/jobs",
  },
  {
    name: "My Applications",
    icon: ClipboardDocumentListIcon,
    path: "/myApplications",
  },
  {
    name: "Profile",
    icon: UserCircleIcon,
    path: "/profile",
  },
  // add more if needed
];

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white font-sans">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-60 bg-gradient-to-tr from-blue-900 via-indigo-900 to-purple-900 p-6 text-gray-300 shadow-xl">
          <div className="mb-8 flex items-center justify-start">
            <div className="text-white font-extrabold text-2xl tracking-widest">
              DASHBOARD
            </div>
          </div>

          <nav className="flex flex-col gap-6 flex-grow">
            {sidebarLinks.map(({ name, icon: Icon, path }, i) => (
              <button
                key={i}
                onClick={() => navigate(path)}
                className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-indigo-700 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title={name}
                aria-label={name}
              >
                <Icon className="h-6 w-6" />
                <span className="font-semibold text-lg">{name}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-6 flex items-center gap-4 px-3 py-2 rounded-lg text-red-400 hover:bg-red-700 hover:text-red-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Logout"
            aria-label="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <span className="font-semibold text-lg">Logout</span>
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto min-h-screen">
          {/* Welcome Box */}
          <section className="mb-10">
            <h1 className="text-4xl font-extrabold mb-2 text-white">
              Welcome, {user.name || "User"}!
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              You're logged in as{" "}
              <span className="font-semibold text-indigo-300 capitalize">
                {user.role || "User"}
              </span>
              .
            </p>
            <p className="text-gray-400 mt-1">
              <strong>Email:</strong> {user.email || "N/A"}
            </p>
            <p className="text-gray-400">
              <strong>Role:</strong> {user.role || "User"}
            </p>
          </section>

          {/* Action Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-indigo-800/80 backdrop-blur-lg shadow-lg text-white p-6 rounded-xl border border-indigo-600 hover:shadow-indigo-500 transition transform hover:-translate-y-1 hover:scale-[1.02]">
              <h3 className="text-2xl font-semibold mb-3">Explore Jobs</h3>
              <p className="mb-5 text-indigo-300">Browse and apply for jobs.</p>
              <button
                onClick={() => navigate("/jobs")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-md shadow-md transition"
              >
                Start Exploring
              </button>
            </div>

            <div className="bg-indigo-800/80 backdrop-blur-lg shadow-lg text-white p-6 rounded-xl border border-indigo-600 hover:shadow-indigo-500 transition transform hover:-translate-y-1 hover:scale-[1.02]">
              <h3 className="text-2xl font-semibold mb-3">My Applications</h3>
              <p className="mb-5 text-indigo-300">View your job applications.</p>
              <button
                onClick={() => navigate("/myApplications")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-md shadow-md transition"
              >
                View Applications
              </button>
            </div>

            <div className="bg-indigo-800/80 backdrop-blur-lg shadow-lg text-white p-6 rounded-xl border border-indigo-600 hover:shadow-indigo-500 transition transform hover:-translate-y-1 hover:scale-[1.02]">
              <h3 className="text-2xl font-semibold mb-3">Profile</h3>
              <p className="mb-5 text-indigo-300">Manage your user profile.</p>
              <button
                onClick={() => navigate("/profile")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-md shadow-md transition"
              >
                View Profile
              </button>
            </div>
          </section>

          
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
