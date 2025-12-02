import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useSettings } from "../settings/SettingsContext";

const navLinkClass = ({ isActive }) =>
  "sidebar-link" + (isActive ? " sidebar-link-active" : "");

function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useSettings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h1 className="logo">SmartBudget</h1>
        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={navLinkClass}>
            Transactions
          </NavLink>
          <NavLink to="/budgets" className={navLinkClass}>
            Budgets
          </NavLink>
          <NavLink to="/goals" className={navLinkClass}>
            Goals
          </NavLink>
          <NavLink to="/reports" className={navLinkClass}>
            Reports
          </NavLink>
          <NavLink to="/notifications" className={navLinkClass}>
            Notifications
          </NavLink>
          <NavLink to="/settings" className={navLinkClass}>
            Settings
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span className="topbar-title">
            Extended Smart Budgeting Dashboard
          </span>

          <div className="topbar-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "☀ Light mode" : "🌙 Dark mode"}
            </button>

            {user && <span className="muted">Hi, {user.username}</span>}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}

export default Layout;
