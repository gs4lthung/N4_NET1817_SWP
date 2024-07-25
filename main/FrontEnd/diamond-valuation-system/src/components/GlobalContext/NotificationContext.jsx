import React, { createContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(0);

  const incrementNotifications = () => {
    setNotifications((prev) => prev + 1);
  };

  const resetNotifications = () => {
    setNotifications(0);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, incrementNotifications, resetNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
