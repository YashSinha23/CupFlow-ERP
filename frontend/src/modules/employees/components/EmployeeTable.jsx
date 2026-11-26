import { ArrowUpRight } from "lucide-react";
import styles from "./EmployeeTable.module.css";

function formatDate(value) {
  if (!value) return "—";
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

export default function EmployeeTable({ employees, loading, onOpen }) {
  if (loading) {
    return <div className={styles.message}>Loading employees…</div>;
  }

  if (employees.length === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon} aria-hidden="true">♙</span>
        <strong>No employees found</strong>
        <span>Try another filter or add an employee to start the directory.</span>
      </div>
    );
  }

  return (
    <div className={styles.tableScroller}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Job title</th>
            <th>Department</th>
            <th>Joined</th>
            <th>Login</th>
            <th>Status</th>
            <th><span className={styles.srOnly}>Open details</span></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} onClick={() => onOpen(employee)}>
              <td>
                <button
                  type="button"
                  className={styles.employeeButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpen(employee);
                  }}
                >
                  <span className={styles.avatar} aria-hidden="true">
                    {employee.fullName?.trim()?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                  <span className={styles.employeeIdentity}>
                    <strong>{employee.fullName}</strong>
                    <span>{employee.employeeCode}</span>
                  </span>
                </button>
              </td>
              <td>{employee.jobTitle}</td>
              <td>{employee.department}</td>
              <td>{formatDate(employee.dateOfJoining)}</td>
              <td>
                <span className={employee.loginAccountLinked ? styles.loginLinked : styles.loginUnlinked}>
                  {employee.loginAccountLinked ? "Linked" : "No login"}
                </span>
              </td>
              <td>
                <span className={employee.status === "ACTIVE" ? styles.activeStatus : styles.inactiveStatus}>
                  {employee.status === "ACTIVE" ? "Active" : "Inactive"}
                </span>
              </td>
              <td className={styles.openCell}>
                <button
                  type="button"
                  className={styles.openButton}
                  aria-label={`Open ${employee.fullName}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpen(employee);
                  }}
                >
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
