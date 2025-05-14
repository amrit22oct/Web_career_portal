import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import '../styles/studentDash.css';  // Import the new CSS file

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
    <div className="dashboard-container">
      <div className="flex">
        {/* Sidebar */}
        <div className="sidebar">
          <h2>Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            <button
              onClick={() => navigate('/jobs')}  // Navigate to job page
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              Explore Jobs
            </button>
            <button 
              onClick={() => navigate('/myApplications')} // Navigate to My Applications page (update this route as per your design)
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              My Applications
            </button>
            <button 
              onClick={() => navigate('/profile')} // Navigate to Profile Page
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              Profile
            </button>
            <button 
              onClick={() => navigate('/Internships')} // Add navigation to settings page
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              Internships
            </button>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </nav>
        </div>

        {/* Main Dashboard Content */}
        <div className="main-content">
          <div className="dashboard-card glassy-card">
            {/* Welcome Section */}
            <h1>Welcome, {user.name}!</h1>
            <p>
              You're logged in as a {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}.
            </p>
            
            {/* User Info Section */}
            <div className="user-info">
              <div className="user-info-item">
                <p className="label">Email:</p>
                <p className="value">{user.email}</p>
              </div>
              <div className="user-info-item">
                <p className="label">Role:</p>
                <p className="value">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </p>
              </div>
            </div>

            {/* Dashboard Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="action-card">
                <h3>Explore Jobs</h3>
                <p>Browse through the latest job opportunities and apply.</p>
                <button className="action-button" onClick={() => navigate('/jobs')}>Start Exploring</button>
              </div>
              <div className="action-card">
                <h3>My Applications</h3>
                <p>View and manage your job applications.</p>
                <button className="action-button" onClick={() => navigate('/myApplications')}>View Applications</button>
              </div>
              <div className="action-card">
                <h3>Profile</h3>
                <p>Update your profile and preferences.</p>
                <button className="action-button" onClick={() => navigate('/profile')}>Edit Profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
