import styles from "./UserTable.module.css";
import { Skeleton } from "@chakra-ui/react";

export default function UserTable({ users, loading, onRowClick }) {
  if (loading) {
    return (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                <td>
                  <Skeleton height="18px" width="140px" />
                </td>
                <td>
                  <Skeleton height="18px" width="200px" />
                </td>
                <td>
                  <Skeleton height="18px" width="80px" />
                </td>
                <td>
                  <Skeleton height="24px" width="70px" />
                </td>
                <td>
                  <Skeleton height="18px" width="100px" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return <p className={styles.empty}>No users found.</p>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} onClick={() => onRowClick(user)}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span className={user.active ? styles.active : styles.inactive}>
                  {user.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
