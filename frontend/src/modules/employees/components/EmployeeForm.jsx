import { useState } from "react";
import { createEmployee, updateEmployee } from "../api";
import { notify } from "../../../lib/toast";
import styles from "./EmployeeForm.module.css";

const EMPTY_FORM = {
  fullName: "",
  jobTitle: "",
  department: "",
  dateOfJoining: "",
  contactPhone: "",
  contactEmail: "",
};

export default function EmployeeForm({ employee, onSuccess, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    fullName: employee?.fullName ?? "",
    jobTitle: employee?.jobTitle ?? "",
    department: employee?.department ?? "",
    dateOfJoining: employee?.dateOfJoining ?? "",
    contactPhone: employee?.contactPhone ?? "",
    contactEmail: employee?.contactEmail ?? "",
  }));
  const [submitting, setSubmitting] = useState(false);
  const editing = Boolean(employee);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const payload = {
      ...form,
      dateOfJoining: form.dateOfJoining || null,
      contactPhone: form.contactPhone.trim() || null,
      contactEmail: form.contactEmail.trim() || null,
    };

    setSubmitting(true);
    try {
      if (editing) {
        await updateEmployee(employee.id, payload);
        notify.success("Employee details saved.");
      } else {
        await createEmployee(payload);
        notify.success("Employee added.");
      }
      onSuccess();
    } catch (error) {
      notify.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>EMPLOYEE DIRECTORY</p>
        <h2>{editing ? "Edit employee" : "Add employee"}</h2>
        <p>Employment details are separate from the person’s CupFlow login.</p>
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Full name <b>*</b></span>
          <input name="fullName" value={form.fullName} onChange={updateField} maxLength={255} autoComplete="name" required />
        </label>
        <label className={styles.field}>
          <span>Job title <b>*</b></span>
          <input name="jobTitle" value={form.jobTitle} onChange={updateField} maxLength={255} placeholder="e.g. Machine operator" required />
        </label>
        <label className={styles.field}>
          <span>Department <b>*</b></span>
          <input name="department" value={form.department} onChange={updateField} maxLength={255} placeholder="e.g. Production" required />
        </label>
        <label className={styles.field}>
          <span>Date of joining <b>*</b></span>
          <input name="dateOfJoining" type="date" value={form.dateOfJoining} onChange={updateField} required />
        </label>
        <label className={styles.field}>
          <span>Contact phone <b>*</b></span>
          <input name="contactPhone" type="tel" value={form.contactPhone} onChange={updateField} maxLength={20} autoComplete="tel" required />
        </label>
        <label className={styles.field}>
          <span>Contact email <b>*</b></span>
          <input name="contactEmail" type="email" value={form.contactEmail} onChange={updateField} maxLength={255} autoComplete="email" required />
        </label>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" className={styles.primaryButton} disabled={submitting}>
          {submitting ? "Saving…" : editing ? "Save changes" : "Add employee"}
        </button>
      </div>
    </form>
  );
}
