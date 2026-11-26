import { Plus } from "lucide-react";
import { toDateInputValue } from "../dateUtils";
import styles from "./ShiftScheduleGrid.module.css";

function AssignmentCell({ employee, date, assignment, selectionMode, selected, onSelect }) {
  const status = assignment?.assignmentStatus;
  const label = status === "SHIFT"
    ? assignment.shiftCode
    : status === "OFF"
      ? "OFF"
      : status === "CANCELLED"
        ? "Cancelled"
        : "Assign";
  const tone = status ? styles[`status_${status.toLowerCase()}`] : styles.emptyCell;

  return (
    <button
      type="button"
      className={`${styles.assignmentCell} ${tone} ${selected ? styles.selectedCell : ""}`}
      aria-pressed={selectionMode ? selected : undefined}
      onClick={() => onSelect({ employee, date, assignment })}
      aria-label={`${employee.fullName}, ${date.toLocaleDateString("en-IN")}: ${label}`}
      title={status === "SHIFT" ? `${assignment.shiftName} · ${assignment.startTime.slice(0, 5)}–${assignment.endTime.slice(0, 5)}` : label}
    >
      {status ? <span>{label}</span> : <Plus size={13} aria-hidden="true" />}
    </button>
  );
}

export default function ShiftScheduleGrid({ employees, dates, weekDays, assignmentsByKey, selectionMode, selectedKeys, onSelect }) {
  return (
    <>
      <div className={styles.desktopGrid}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.employeeHeading}>Employee</th>
              {dates.map((date) => (
                <th key={toDateInputValue(date)} className={styles.dateHeading}>
                  <span>{date.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                  <strong>{date.getDate()}</strong>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <th scope="row" className={styles.employeeCell}>
                  <strong>{employee.fullName}</strong>
                  <span>{employee.employeeCode} · {employee.department}</span>
                </th>
                {dates.map((date) => {
                  const dateKey = toDateInputValue(date);
                  return (
                    <td key={dateKey}>
                      <AssignmentCell
                        employee={employee}
                        date={date}
                        assignment={assignmentsByKey.get(`${employee.id}:${dateKey}`)}
                        selectionMode={selectionMode}
                        selected={selectedKeys.has(`${employee.id}:${dateKey}`)}
                        onSelect={onSelect}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.mobileGrid}>
        <div className={styles.mobileDateRow}>
          <span className={styles.mobileEmployeeHeading}>Employee</span>
          {weekDays.map((date) => (
            <span className={styles.mobileDate} key={toDateInputValue(date)}>
              <small>{date.toLocaleDateString("en-IN", { weekday: "short" })}</small>
              <strong>{date.getDate()}</strong>
            </span>
          ))}
        </div>
        {employees.map((employee) => (
          <article className={styles.mobileEmployee} key={employee.id}>
            <div className={styles.mobileEmployeeName}>
              <strong>{employee.fullName}</strong>
              <span>{employee.employeeCode} · {employee.department}</span>
            </div>
            <div className={styles.mobileCells}>
              {weekDays.map((date) => {
                const dateKey = toDateInputValue(date);
                return (
                  <AssignmentCell
                    key={dateKey}
                    employee={employee}
                    date={date}
                    assignment={assignmentsByKey.get(`${employee.id}:${dateKey}`)}
                    selectionMode={selectionMode}
                    selected={selectedKeys.has(`${employee.id}:${dateKey}`)}
                    onSelect={onSelect}
                  />
                );
              })}
            </div>
          </article>
        ))}
      </div>

      {employees.length === 0 && (
        <div className={styles.emptyState}>No active employees match the selected filters.</div>
      )}
    </>
  );
}
