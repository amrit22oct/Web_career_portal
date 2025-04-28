import API from './api';

// Helper function to handle errors
const handleError = (error) => {
  if (error.response && error.response.data) {
    throw error.response.data;
  } else {
    throw { message: error.message || 'An unknown error occurred' };
  }
};

const NotificationService = {
  // Get all notifications for the user
  getNotifications: async () => {
    try {
      const response = await API.get('/notifications');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Mark a notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await API.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Create a new notification (for admin, recruiters, etc.)
  createNotification: async (notificationData) => {
    try {
      const response = await API.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

export default NotificationService;
