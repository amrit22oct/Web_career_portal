import API from './api'; // Import your API setup

const register = async (userData) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error; // Better error handling
  }
};

const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const logout = async () => {
  try {
    const response = await API.post('/auth/logout');
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
