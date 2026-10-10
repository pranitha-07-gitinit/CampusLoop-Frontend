
import { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("campusloopUser"));
    } catch {
      return null;
    }
  });

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const loadNotifications = async () => {
    if (!user?.id) return;

    try {
      const [notificationsResponse, countResponse] = await Promise.all([
        fetch(`https://campusloop-backend.onrender.com/api/notifications/user/${user.id}`),
        fetch(
          `https://campusloop-backend.onrender.com/api/notifications/user/${user.id}/unread-count`
        )
      ]);

      if (notificationsResponse.ok && countResponse.ok) {
        const notificationData = await notificationsResponse.json();
        const countData = await countResponse.json();

        setNotifications(notificationData);
        setUnreadCount(countData);
      }
    } catch (error) {
      console.error("Unable to load notifications:", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("campusloopUser");
    setUser(null);
    window.location.href = "/";
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.readStatus) {
        const response = await fetch(
          `https://campusloop-backend.onrender.com/api/notifications/${notification.id}/read/user/${user.id}`,
          { method: "PUT" }
        );

        if (response.ok) {
          setNotifications((previous) =>
            previous.map((item) =>
              item.id === notification.id
                ? { ...item, readStatus: true }
                : item
            )
          );

          setUnreadCount((previous) => Math.max(0, previous - 1));
        }
      }

      setShowNotifications(false);
      window.location.href = "/requests";
    } catch (error) {
      console.error("Unable to mark notification as read:", error);
      alert("Unable to update notification. Please try again.");
    }
  };

  return (
    <nav className="navbar">
      <h2>CampusLoop</h2>

      <div className="nav-links">
        <a href="/">Home</a>

        <a href="/requests">Lost & Found</a>

        {user && (
          <>
            <a href="/report">Report Item</a>
            <a href="/my-reports">My Reports</a>
          </>
        )}

        {user && user.role === "ADMIN" && (
          <a href="/admin">Admin</a>
        )}

        {user && (
          <div className="notification-wrapper">
            <button
              type="button"
              className="notification-bell"
              aria-label={`Notifications, ${unreadCount} unread`}
              onClick={() => {
                const nextState = !showNotifications;
                setShowNotifications(nextState);

                if (nextState) {
                  loadNotifications();
                }
              }}
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <strong>Notifications</strong>
                  <button
                    type="button"
                    onClick={loadNotifications}
                    className="refresh-notifications"
                  >
                    Refresh
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <p className="no-notifications">
                    No notifications yet.
                  </p>
                ) : (
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <button
                        type="button"
                        key={notification.id}
                        className={`notification-item ${
                          notification.readStatus ? "read" : "unread"
                        }`}
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                      >
                        <span>{notification.message}</span>
                        {!notification.readStatus && (
                          <span className="unread-dot">●</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {user ? (
          <>
            <span className="welcome">Hi, {user.name}</span>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;