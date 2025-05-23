import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobDetailsPage from './pages/JobDetailPage';
import ProfilePage from './pages/ProfilePage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import About from './pages/About';
import JobsPage from './pages/JobsPage';
import DashboardPage from './pages/DashboardPage';
import InternshipPage from './pages/InternshipPage';
import ApplicationsPage from './pages/ApplicationsPage';
import RecruiterApplicationsPage from './pages/RecruiterApplicationsPage'; // ✅ New import
import NotFoundPage from './pages/NotFoundPage';

import PrivateRoute from './components/PrivateRoute';
import StudentRoute from './components/StudentRoute';
import RecruiterRoute from './components/RecruiterRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { JobProvider } from './context/JobContext';

const App = () => (
  <JobProvider>
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/internships" element={<InternshipPage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Student Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <StudentRoute>
                <DashboardPage />
              </StudentRoute>
            }
          />

          {/* Student Applications Page */}
          <Route
            path="/myApplications"
            element={
              <StudentRoute>
                <ApplicationsPage />
              </StudentRoute>
            }
          />

          {/* Recruiter Dashboard */}
          <Route
            path="/recruiter/dashboard"
            element={
              <RecruiterRoute>
                <RecruiterDashboardPage />
              </RecruiterRoute>
            }
          />

          {/* Recruiter Applications Page - ✅ ADDED */}
          <Route
            path="/recruiter/myapplications"
            element={
              <RecruiterRoute>
                <RecruiterApplicationsPage />
              </RecruiterRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </JobProvider>
);

export default App;
