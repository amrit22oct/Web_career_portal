import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RecruiterRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="text-lg text-gray-500">Loading, please wait...</div>
      </div>
    );
  }

  // Not logged in → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not a recruiter → send to student dashboard
  if (user.role !== 'recruiter') {
    return <Navigate to="/dashboard" replace />;
  }

  // OK
  return children;
};

export default RecruiterRoute;
