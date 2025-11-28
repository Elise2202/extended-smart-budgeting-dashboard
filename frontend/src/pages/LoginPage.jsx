import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function LoginPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="login-page">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="card login-card">
        <h1>Welcome</h1>
        <p className="muted">Sign in to access your SmartBudget dashboard.</p>

        {error && <div className="error-box">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
  <label>
    Username
    <input
      type="text"
      name="username"
      value={form.username}
      onChange={handleChange}
      autoComplete="username"
      required
    />
  </label>

  <label>
    Password
    <input
      type="password"
      name="password"
      value={form.password}
      onChange={handleChange}
      autoComplete="current-password"
      required
    />
  </label>

  <button type="submit" className="login-button">
    {submitting ? "Signing in..." : "Sign in"}
  </button>
</form>

      </div>
    </div>
  );
}

export default LoginPage;
