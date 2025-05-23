import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // If still loading, show a more user-friendly loading state
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="text-lg text-gray-500">Loading, please wait...</div>
      </div>
    );
  }

  // If there's no user (not authenticated), redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child component
  return children;
};

export default PrivateRoute;
