import { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state to handle errors
  const navigate = useNavigate();
  const location = useLocation();

  // Separate fetchUser function to expose in context
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (!token || !tokenExpiry || Date.now() > tokenExpiry) {
      setUser(null); // Ensure user is set to null if no token or token is expired
      return;
    }

    try {
      const { data } = await API.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch (err) {
      console.error('Error fetching user:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      setUser(null);
      setError('Session expired, please log in again.');
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      if (!token || !tokenExpiry || Date.now() > tokenExpiry) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);

        // only redirect if currently at login or register page
        if (location.pathname === '/login' || location.pathname === '/register') {
          if (data.role === 'recruiter') {
            navigate('/recruiter/dashboard');
          } else {
            navigate('/dashboard');
          }
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        setUser(null);
        setError('Session expired, please log in again.'); // Provide error message on failure
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate, location.pathname]);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data?.user && data?.token) {
        const expiryTime = Date.now() + data.expiresIn * 1000;
        localStorage.setItem('token', data.token);
        localStorage.setItem('tokenExpiry', expiryTime);
        setUser(data.user);

        // redirect immediately after login
        if (data.user.role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials, please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    setUser(null);
    navigate('/login');
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, updateUser, fetchUser }}>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center bg-gray-100">
          <div className="text-lg text-gray-500">Loading...</div>
        </div>
      ) : error ? (
        <div className="w-full h-screen flex justify-center items-center bg-gray-100">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
