import { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch current user using token
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
      logout();
      return;
    }

    try {
      const { data } = await API.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch (err) {
      logout();
      setError('Error fetching user data.');
    }
  };

  // Initial auth check
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry');

      if (!token || !tokenExpiry || Date.now() > parseInt(tokenExpiry)) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data);

        // Redirect user based on their role if on login/register page
        if (location.pathname === '/login' || location.pathname === '/register') {
          if (data.role === 'recruiter') {
            navigate('/recruiter/dashboard');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [navigate, location.pathname]);

  // Login handler
  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });

      if (data?.user && data?.token) {
        const expiryTime = Date.now() + data.expiresIn * 1000;
        localStorage.setItem('token', data.token);
        localStorage.setItem('tokenExpiry', expiryTime);
        setUser(data.user);

        if (data.user.role === 'recruiter') {
          navigate('/recruiter/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError('Invalid credentials, please try again.');
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    setUser(null);
    navigate('/login');
  };

  // Update user details in state
  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, fetchUser, updateUser }}
    >
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
