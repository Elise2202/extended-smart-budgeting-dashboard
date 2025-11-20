import React from "react";

function ErrorMessage({ error }) {
  if (!error) return null;

  const message =
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred.";

  return <div className="error-box">⚠ {message}</div>;
}

export default ErrorMessage;
