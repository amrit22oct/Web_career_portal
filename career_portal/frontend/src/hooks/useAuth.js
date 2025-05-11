import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUser = (role) => {
    const expectedPath = role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard';
    if (location.pathname !== expectedPath) {
      navigate(expectedPath);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const expiry = localStorage.getItem('tokenExpiry');

      if (!token || !expiry || Date.now() > parseInt(expiry)) {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data && data.role) {
          setUser(data);
          redirectUser(data.role);
        } else {
          throw new Error('Invalid user data');
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
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
