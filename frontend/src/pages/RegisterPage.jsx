// frontend/src/pages/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { registerRequest } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";

function RegisterPage() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
    const validateForm = () => {
  const username = form.username.trim();
  const password = (form.password ?? "").trim();
  const confirmPassword = (form.confirmPassword ?? "").trim();

  if (username.length < 3) {
    return "Username must be at least 3 characters long.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return null;
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const username = form.username.trim();

      // 1) register user
      await registerRequest({ username, password: form.password });

      // 2) auto-login
      await login({ username, password: form.password });

      // 3) go to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed. Try a different username.";
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
        <h1>Create account</h1>
        <p className="muted">Register to start using SmartBudget.</p>

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
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <span className="password-hint muted">
              Min 8 chars, 1 uppercase, 1 number.
            </span>
          </label>

          <label>
            Confirm password
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </label>

          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Sign in instead</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
