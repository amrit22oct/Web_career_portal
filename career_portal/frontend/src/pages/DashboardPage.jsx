import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-800 to-slate-700 text-white">
      {/* Content container that fills full height */}
      <div className="flex flex-1 flex-col lg:flex-row gap-6 p-6">
        {/* Sidebar */}
        <aside className="lg:w-1/5 w-full bg-slate-900/80 p-6 rounded-xl shadow-lg border border-white space-y-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <nav className="flex flex-col gap-4">
            <button onClick={() => navigate('/jobs')} className="hover:text-blue-400 text-left">Explore Jobs</button>
            <button onClick={() => navigate('/myApplications')} className="hover:text-blue-400 text-left">My Applications</button>
            <button onClick={() => navigate('/profile')} className="hover:text-blue-400 text-left">Profile</button>
            <button onClick={() => navigate('/Internships')} className="hover:text-blue-400 text-left">Internships</button>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-600 text-left">Logout</button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-grow bg-white/10 backdrop-blur-xl p-8 rounded-xl border border-white shadow-2xl space-y-6">
            {/* Welcome Message */}
            <header>
              <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
              <p className="text-gray-200 mt-2">
                You're logged in as a <span className="capitalize font-semibold">{user.role}</span>.
              </p>
            </header>

            {/* User Info Panel */}
            <section className="bg-white/10 rounded-lg p-4 text-gray-100 space-y-3 border border-white/20 shadow-inner">
              <div className="flex justify-between border-b border-gray-500 pb-2">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span className="capitalize">{user.role}</span>
              </div>
            </section>

            {/* Action Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-blue-500/10 border border-white p-6 rounded-lg hover:bg-blue-500/20 transition transform hover:-translate-y-1 shadow-md">
                <h3 className="text-xl font-semibold mb-2">Explore Jobs</h3>
                <p>Browse the latest job opportunities and apply easily.</p>
                <button onClick={() => navigate('/jobs')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                  Start Exploring
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-blue-500/10 border border-white p-6 rounded-lg hover:bg-blue-500/20 transition transform hover:-translate-y-1 shadow-md">
                <h3 className="text-xl font-semibold mb-2">My Applications</h3>
                <p>Track your submitted applications in one place.</p>
                <button onClick={() => navigate('/myApplications')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                  View Applications
                </button>
              </div>

              {/* Card 3 */}
              <div className="bg-blue-500/10 border border-white p-6 rounded-lg hover:bg-blue-500/20 transition transform hover:-translate-y-1 shadow-md">
                <h3 className="text-xl font-semibold mb-2">Profile</h3>
                <p>Update your personal info and resume.</p>
                <button onClick={() => navigate('/profile')} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                  Edit Profile
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
