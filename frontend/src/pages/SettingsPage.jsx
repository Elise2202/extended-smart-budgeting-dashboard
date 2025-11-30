import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import { getSettings, updateSettings } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../auth/AuthContext";

function SettingsPage() {
  const { user } = useAuth();
  const username = user?.username;

  const { data, loading, error, setData } = useApi(
    () => (username ? getSettings(username) : Promise.resolve(null)),
    [username]
  );

  const [form, setForm] = useState({
    currency: "USD",
    defaultPeriod: "MONTH",
    locale: "en-US",
  });

  useEffect(() => {
    if (data) {
      setForm({
        currency: data.currency || "USD",
        defaultPeriod: data.defaultPeriod || "MONTH",
        locale: data.locale || "en-US",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;
    const updated = await updateSettings(username, form);
    setData(updated);
  };

  return (
    <>
      <h1>Settings</h1>

      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} />

      {!loading && (
        <form className="card settings-form" onSubmit={handleSubmit}>
          <label>
            Currency
            <input
              type="text"
              name="currency"
              value={form.currency}
              onChange={handleChange}
            />
          </label>

          <label>
            Default Period
            <select
              name="defaultPeriod"
              value={form.defaultPeriod}
              onChange={handleChange}
            >
              <option value="MONTH">Month</option>
              <option value="WEEK">Week</option>
              <option value="YEAR">Year</option>
            </select>
          </label>

          <label>
            Locale
            <input
              type="text"
              name="locale"
              value={form.locale}
              onChange={handleChange}
            />
          </label>

          <button type="submit">Save</button>
        </form>
      )}
    </>
  );
}

export default SettingsPage;
