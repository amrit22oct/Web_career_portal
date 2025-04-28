import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirecting user after logout
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      {/* Dashboard Layout */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg rounded-2xl p-6 flex flex-col space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">Explore Jobs</button>
            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">My Applications</button>
            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">Profile</button>
            <button className="text-gray-700 hover:text-blue-600 focus:outline-none">Settings</button>
            <button 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 focus:outline-none"
            >
              Logout
            </button>
          </nav>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex-1 p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* Welcome Section */}
            <h1 className="text-4xl font-extrabold text-gray-800">Welcome, {user.name}!</h1>
            <p className="text-lg text-gray-700">
              You're logged in as a {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}.
            </p>
            
            {/* User Info Section */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-700 font-semibold">Email:</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700 font-semibold">Role:</p>
                <p className="text-gray-600">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
              </div>
            </div>

            {/* Dashboard Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg hover:bg-blue-700 transition duration-300">
                <h3 className="text-2xl font-semibold">Explore Jobs</h3>
                <p>Browse through the latest job opportunities and apply.</p>
                <button className="mt-4 bg-white text-blue-600 py-2 px-6 rounded-full font-semibold hover:bg-blue-50 transition duration-300">
                  Start Exploring
                </button>
              </div>
              <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-lg hover:bg-purple-700 transition duration-300">
                <h3 className="text-2xl font-semibold">My Applications</h3>
                <p>View and manage your job applications.</p>
                <button className="mt-4 bg-white text-purple-600 py-2 px-6 rounded-full font-semibold hover:bg-purple-50 transition duration-300">
                  View Applications
                </button>
              </div>
              <div className="bg-green-600 text-white p-6 rounded-2xl shadow-lg hover:bg-green-700 transition duration-300">
                <h3 className="text-2xl font-semibold">Profile</h3>
                <p>Update your profile and preferences.</p>
                <button className="mt-4 bg-white text-green-600 py-2 px-6 rounded-full font-semibold hover:bg-green-50 transition duration-300">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Dashboard Footer */}
            <div className="mt-8">
              <p className="text-center text-gray-600">© 2025 Web Career Portal. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
