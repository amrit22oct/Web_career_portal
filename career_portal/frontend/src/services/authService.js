import API from './api';

const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    
    // Store user ID and token in localStorage or sessionStorage
    if (response.data?.user && response.data?.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user info
      localStorage.setItem('token', response.data.token); // Store the token
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const logout = async () => {
  try {
    const response = await API.post('/auth/logout');
    
    // Clear user and token from storage on logout
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const AuthService = {
  register,
  login,
  logout,
};

export default AuthService;
