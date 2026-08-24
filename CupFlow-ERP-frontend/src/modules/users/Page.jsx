import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { getUsers } from "./api";
import UserTable from "./components/UserTable";
import CreateUserForm from "./components/CreateUserForm";
import UserDetailCard from "./components/UserDetailsCard";
import Modal from "../../components/Modal";
import styles from "./Page.module.css";

export default function Page() {
  const {
    data: users,
    loading,
    error,
    refetch,
  } = useFetch(() => getUsers(), []);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const totalUsers = users?.length || 0;
  const activeUsers = (users || []).filter((user) => user.active).length;
  const inactiveUsers = (users || []).filter((user) => !user.active).length;

  const roles = [...new Set((users || []).map((user) => user.role))];

  const filteredUsers = (users || []).filter((user) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      user.fullName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search);

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && user.active) ||
      (statusFilter === "INACTIVE" && !user.active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  function handleCreateSuccess() {
    setShowCreateForm(false);
    refetch();
  }

  if (loading) {
    return <p>Loading Users...</p>;
  }

  if (error) {
    return <p>Error loading users: {error.message}</p>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h1>Users</h1>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <span>♙</span>
            </div>

            <div className={styles.statInfo}>
              <h3>Total Users</h3>
              <p>{totalUsers}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <span>✓</span>
            </div>

            <div className={styles.statInfo}>
              <h3>Active Users</h3>
              <p>{activeUsers}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <span>×</span>
            </div>

            <div className={styles.statInfo}>
              <h3>Inactive Users</h3>
              <p>{inactiveUsers}</p>
            </div>
          </div>
        </div>
        {showCreateForm && (
          <Modal onClose={() => setShowCreateForm(false)}>
            <CreateUserForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </Modal>
        )}
        <div className={styles.filtersBar}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>⌕</span>

            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.trim())}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>

            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>

            <option value="ACTIVE">Active</option>

            <option value="INACTIVE">Inactive</option>
          </select>

          <button
            className={styles.createUserButton}
            onClick={() => setShowCreateForm(true)}
          >
            + Create User
          </button>
        </div>
        <UserTable users={filteredUsers} onRowClick={setSelectedUser} />
      </div>
      {selectedUser && (
        <UserDetailCard
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onStatusChange={refetch}
        />
      )}
    </div>
  );
}
