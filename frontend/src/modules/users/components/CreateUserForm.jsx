import { useState } from "react";
import { createUser } from "../api";
import styles from "./CreateUserForm.module.css";
import { notify } from "../../../lib/toast";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "HR_MANAGER", label: "HR Manager" },
  { value: "FLOOR_SUPERVISOR", label: "Floor Supervisor" },
  { value: "WORKER", label: "Worker" },
];

export default function CreateUserForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createUser(form);
      notify.success("User Created Successfully");
      onSuccess();
    } catch (error) {
      notify.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Create User</h2>

      <div className={styles.fieldGroup}>
        <label htmlFor="fullName">Full Name</label>

        <input
          id="fullName"
          type="text"
          name="fullName"
          placeholder="Enter full name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="email">Email</label>

        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="password">Password</label>

        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="role">Role</label>

        <select
          id="role"
          name="role"
          value={form.role}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Role
          </option>

          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Submit"}
        </button>
      </div>
    </form>
  );
}