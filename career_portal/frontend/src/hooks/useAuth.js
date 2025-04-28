import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();  // 👈 New: to know current path

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setUser(response.data);

          // Redirect only if not already at the correct dashboard
          if (response.data.role === 'recruiter' && location.pathname !== '/recruiter/dashboard') {
            navigate('/recruiter/dashboard');
          } else if (response.data.role === 'student' && location.pathname !== '/dashboard') {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        setUser(null);
        setError('Failed to authenticate. Please log in again.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, location]);

  return { user, loading, error };
};

export default useAuth;
