import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "./api";
import { useState } from "react";
import styles from "./Page.module.css";
import { notify } from "../../lib/toast";

export default function Page() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleLogin(email, password, demo = false) {
    if (demo) {
      setIsDemoLoading(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      const data = await loginUser(email, password);
      login(data);
      navigate("/");
    } catch (err) {
      notify.error(err.message);
    } finally {
      setIsSubmitting(false);
      setIsDemoLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    await handleLogin(form.email, form.password);
  }

  async function handleDemoLogin() {
    await handleLogin("demo_admin@cupflow.com", "Demo@1234", true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1 className={styles.title}>Login Page</h1>

          <div className={styles.field}>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className={styles.button}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <button
            className={styles.demoButton}
            type="button"
            onClick={handleDemoLogin}
            disabled={isDemoLoading}
          >
            {isDemoLoading ? "Logging in..." : "Login as Demo"}
          </button>
        </form>
      </div>
    </div>
  );
}
