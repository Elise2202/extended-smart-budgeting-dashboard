import React from "react";
import useApi from "../hooks/useApi";
import { useAuth } from "../auth/AuthContext";
import {
  getNotifications,
  sendTestNotification,
} from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function NotificationsPage() {
  const { user } = useAuth();
  const username = user?.username;

  const {
    data: notifications = [],
    loading,
    error,
    setData,
  } = useApi(
    () => (username ? getNotifications(username) : Promise.resolve([])),
    [username]
  );

  const handleSendTest = async () => {
    await sendTestNotification(username);
    setData(await getNotifications(username)); // reload
  };

  return (
    <>
      <h1>Notifications</h1>

      <button onClick={handleSendTest} style={{ marginBottom: "1rem" }}>
        Send Test Notification
      </button>

      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} />

      {!loading && (
        <div className="card">
          <h2>Your Notifications</h2>

          {notifications.length === 0 ? (
            <p className="muted">No notifications yet.</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={
                    "notification-item " + (n.read ? "read" : "unread")
                  }
                >
                  <div className="notification-header">
                    <strong>{n.type}</strong>
                    <span className="muted">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p>{n.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

export default NotificationsPage;
