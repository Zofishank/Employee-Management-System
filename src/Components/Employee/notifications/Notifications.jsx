import React, { createContext, useContext, useRef, useState } from "react";

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used inside NotificationsProvider",
    );
  }
  return context;
};

const NotificationsProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0); // ← shared unread count
  const timerRef = useRef(null);

  const showNotification = (message, type = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotification({ message, type });
    timerRef.current = setTimeout(() => setNotification(null), 3000);
  };

  return (
    <NotificationContext.Provider
      value={{ showNotification, unreadCount, setUnreadCount }}
    >
      {children}

      {notification && (
        <div
          className={`
            fixed top-5 right-5 z-50
            min-w-[260px] max-w-sm
            px-5 py-3 rounded-lg shadow-xl
            flex items-center gap-3
            text-sm font-medium text-white
            animate-slide-in
            ${
              notification.type === "success"
                ? "bg-[#1A1C2C]"
                : notification.type === "error"
                  ? "bg-red-600"
                  : "bg-gray-700"
            }
          `}
        >
          <span className="text-lg">
            {notification.type === "success" && "✔️"}
            {notification.type === "error" && "❌"}
            {notification.type === "info" && "ℹ️"}
          </span>
          <span className="flex-1">{notification.message}</span>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationsProvider;
