import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobDetailsPage from './pages/JobDetailPage'; // ✅ Fixed import (note the case in the file name)
import ProfilePage from './pages/ProfilePage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import About from './pages/About';
import JobsPage from './pages/JobsPage';
import DashboardPage from './pages/DashboardPage'; // ✅ Import DashboardPage

import PrivateRoute from './components/PrivateRoute';
import StudentRoute from './components/StudentRoute';
import RecruiterRoute from './components/RecruiterRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFoundPage from './pages/NotFoundPage';

import { JobProvider } from './context/JobContext'; // ✅ Import JobProvider

const App = () => (
  <JobProvider> {/* ✅ Wrap with JobProvider */}
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

          {/* Recruiter Dashboard Route */}
          <Route
            path="/recruiter/dashboard"
            element={
              <RecruiterRoute>
                <RecruiterDashboardPage />
              </RecruiterRoute>
            }
          />

          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </JobProvider>
);

export default App;
