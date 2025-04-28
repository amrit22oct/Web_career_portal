import API from './api';

// Helper function to handle errors
const handleError = (error) => {
  if (error.response && error.response.data) {
    throw error.response.data;
  } else {
    throw { message: error.message || 'An unknown error occurred' };
  }
};

const ProfileService = {
  // Get the user profile
  getProfile: async () => {
    try {
      const response = await API.get('/profile');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Update the user profile
  updateProfile: async (profileData) => {
    try {
      const response = await API.put('/profile', profileData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Update the user's profile picture
  updateProfilePicture: async (imageData) => {
    try {
      const response = await API.put('/profile/picture', imageData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Change the user's password
  changePassword: async (passwordData) => {
    try {
      const response = await API.put('/profile/password', passwordData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default ProfileService;
