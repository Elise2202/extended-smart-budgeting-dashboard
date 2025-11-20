import React, { useState } from "react";
import useApi from "../hooks/useApi";
import { getSettings, updateSettings } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

function SettingsPage() {
  const { data, loading, error, setData } = useApi(getSettings, []);
  const [form, setForm] = useState({
    currency: "USD",
    defaultPeriod: "MONTH",
    locale: "en-US"
  });

  React.useEffect(() => {
    if (data) {
      setForm({
        currency: data.currency || "USD",
        defaultPeriod: data.defaultPeriod || "MONTH",
        locale: data.locale || "en-US"
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updateSettings(form);
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
