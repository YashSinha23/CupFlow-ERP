import { useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";
import Modal from "../../../components/Modal";
import { notify } from "../../../lib/toast";
import { saveShiftAssignments } from "../api";
import { toDateInputValue } from "../dateUtils";
import styles from "./ShiftAssignmentEditor.module.css";

export default function ShiftAssignmentEditor({ cell, shifts, onClose, onSaved }) {
  const { employee, date, assignment } = cell;
  const initialStatus = assignment?.assignmentStatus === "OFF" ? "OFF" : "SHIFT";
  const [status, setStatus] = useState(initialStatus);
  const [shiftId, setShiftId] = useState(assignment?.shiftId ?? shifts[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const dateLabel = date.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) return;
    if (status === "SHIFT" && !shiftId) {
      notify.error("Add the five shift templates to the connected database first.");
      return;
    }

    const payload = {
      employeeId: employee.id,
      workDate: toDateInputValue(date),
      assignmentStatus: status,
      shiftId: status === "SHIFT" ? shiftId : null,
    };

    setSaving(true);
    try {
      await saveShiftAssignments([payload]);
      notify.success("Schedule updated.");
      onSaved();
    } catch (error) {
      notify.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function cancelExistingShift() {
    if (saving) return;
    setSaving(true);
    try {
      await saveShiftAssignments([{
        employeeId: employee.id,
        workDate: toDateInputValue(date),
        assignmentStatus: "CANCELLED",
        shiftId: null,
      }]);
      notify.success("Shift cancelled. The schedule record was kept for history.");
      onSaved();
    } catch (error) {
      notify.error(error.message);
      setSaving(false);
    }
  }

  return (
    <Modal onClose={() => !saving && onClose()}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>SHIFT SCHEDULE</p>
          <h2>{employee.fullName}</h2>
          <p>{employee.employeeCode} · {employee.department}</p>
        </header>

        <div className={styles.contextRow}>
          <span><CalendarDays size={15} aria-hidden="true" />{dateLabel}</span>
          {assignment?.assignmentStatus === "SHIFT" && assignment.startTime && (
            <span><Clock3 size={15} aria-hidden="true" />Current: {assignment.shiftCode} · {assignment.startTime.slice(0, 5)}–{assignment.endTime.slice(0, 5)}</span>
          )}
        </div>

        <label className={styles.field}>
          <span>Schedule status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="SHIFT">Assign a shift</option>
            <option value="OFF">Day off</option>
          </select>
        </label>

        {status === "SHIFT" && (
          <label className={styles.field}>
            <span>Shift</span>
            <select value={shiftId} onChange={(event) => setShiftId(event.target.value)} required>
              <option value="" disabled>Select a shift</option>
              {shifts.map((shift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.code} · {shift.displayName} ({shift.startTime.slice(0, 5)}–{shift.endTime.slice(0, 5)}{shift.overnight ? " next day" : ""})
                </option>
              ))}
            </select>
          </label>
        )}

        {assignment?.assignmentStatus === "SHIFT" && (
          <button type="button" className={styles.cancelShift} onClick={cancelExistingShift} disabled={saving}>
            Cancel this shift and keep its history
          </button>
        )}

        <footer className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={onClose} disabled={saving}>Close</button>
          <button type="submit" className={styles.primaryButton} disabled={saving || (status === "SHIFT" && shifts.length === 0)}>
            {saving ? "Saving…" : "Save schedule"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
