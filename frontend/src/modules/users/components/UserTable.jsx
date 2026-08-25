import styles from "./UserTable.module.css";

export default function UserTable({ users, onRowClick }) {
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
                        <tr
                            key={user.id}
                            onClick={() => onRowClick(user)}
                        >
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <span
                                    className={
                                        user.active
                                            ? styles.active
                                            : styles.inactive
                                    }
                                >
                                    {user.active ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td>
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}