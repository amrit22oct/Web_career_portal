import { createContext, useState } from 'react';

// Notification types (for better flexibility and structure)
const notificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = notificationTypes.INFO, duration = 5000) => {
    const newNotification = { message, type, id: Date.now() }; // Adding unique ID for each notification

    setNotifications((prev) => [...prev, newNotification]);

    // Remove notification after the specified duration
    setTimeout(() => removeNotification(newNotification.id), duration);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        notificationTypes, // Exposing notification types for easier use
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
