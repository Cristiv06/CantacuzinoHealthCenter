import React, { useState, useEffect } from "react";
import useNotificationService from "../../services/NotificationService";

const Notifications = () => {
  const { getAllNotifications, readNotification } = useNotificationService();
  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const notifications = await getAllNotifications();
      setNotificationList(notifications);
    };
    getData();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    const updatedNotification = { id: notificationId, isRead: true };
    await readNotification(updatedNotification);
    // Update the notification list to reflect the read status
    setNotificationList((prevList) =>
      prevList.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <div>
      <h2>Notifications</h2>
      {notificationList.map((notification) => (
        <div
          key={notification.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
            backgroundColor: notification.isRead ? "#f0f0f0" : "#ffffff",
          }}
        >
          <p>{notification.message}</p>
          <p>Status: {notification.isRead ? "Read" : "Unread"}</p>
          {!notification.isRead && (
            <button onClick={() => handleMarkAsRead(notification.id)}>
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
