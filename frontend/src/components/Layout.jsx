import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const navLinkClass = ({ isActive }) =>
  "sidebar-link" + (isActive ? " sidebar-link-active" : "");

function Layout({ children }) {
  const { user, logout } = useAuth();
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
          <NavLink to="/settings" className={navLinkClass}>
            Settings
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
        }}>
        {/* LEFT: Title */}
        <span className="topbar-title">Extended Smart Budgeting Dashboard</span>

        {/* RIGHT: Logout button + username */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
