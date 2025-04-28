import { useContext, useEffect } from 'react';
import NotificationContext from '../context/NotificationContext';

const Notification = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  useEffect(() => {
    // Automatically remove notifications after 5 seconds
    const timeoutIds = notifications.map((_, index) =>
      setTimeout(() => removeNotification(index), 5000)
    );

    // Clean up timeouts when the component is unmounted or notifications change
    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, [notifications, removeNotification]);

  return (
    <div className="fixed top-0 right-0 mt-4 mr-4 z-50">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="bg-blue-500 text-white p-4 rounded mb-2 shadow-md transition-all duration-300 ease-in-out transform opacity-100 hover:opacity-80"
        >
          <p>{notification}</p>
          <button
            className="text-sm text-red-500"
            onClick={() => removeNotification(index)}
          >
            Close
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
