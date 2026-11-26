import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import styles from "./ShiftFillToolbar.module.css";

export default function ShiftFillToolbar({ shifts, selectedCount, saving, onApply, onClear }) {
  const [shiftId, setShiftId] = useState(shifts[0]?.id ?? "");

  useEffect(() => {
    if (!shiftId && shifts[0]?.id) setShiftId(shifts[0].id);
  }, [shiftId, shifts]);

  return (
    <div className={styles.toolbar}>
      <div className={styles.selectionInfo}>
        <strong>{selectedCount}</strong>
        <span>{selectedCount === 1 ? "cell selected" : "cells selected"}</span>
      </div>
      <div className={styles.actions}>
        <label className={styles.selectWrap}>
          <span className={styles.srOnly}>Shift to apply</span>
          <select value={shiftId} onChange={(event) => setShiftId(event.target.value)} disabled={saving || shifts.length === 0}>
            {shifts.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.code} · {shift.startTime.slice(0, 5)}–{shift.endTime.slice(0, 5)}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={styles.primaryButton}
          disabled={saving || selectedCount === 0 || shifts.length === 0}
          onClick={() => onApply("SHIFT", shiftId)}
        >
          <Check size={14} aria-hidden="true" />{saving ? "Saving…" : "Apply shift"}
        </button>
        <button type="button" className={styles.secondaryButton} disabled={saving || selectedCount === 0} onClick={() => onApply("OFF", null)}>
          Mark off
        </button>
        <button type="button" className={styles.clearButton} disabled={saving} onClick={onClear} aria-label="Clear selected cells">
          <X size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
