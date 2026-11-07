import { useMemo, useState } from "react";
import { RefreshCw, UserRoundCheck, UserRoundX, Users } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { getUsers } from "./api";
import UserTable from "./components/UserTable";
import CreateUserForm from "./components/CreateUserForm";
import UserDetailCard from "./components/UserDetailsCard";
import Modal from "../../components/Modal";
import styles from "./Page.module.css";

export default function Page() {
  const { data: users, loading, error, refetch } = useFetch(getUsers);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const userList = users ?? [];
  const activeUsers = userList.filter((user) => user.active).length;
  const inactiveUsers = userList.length - activeUsers;
  const roles = [...new Set(userList.map((user) => user.role))];

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return userList.filter((user) => {
      const matchesSearch = [user.fullName, user.email, user.role]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.active) ||
        (statusFilter === "INACTIVE" && !user.active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [userList, searchTerm, roleFilter, statusFilter]);

  function handleCreateSuccess() {
    setShowCreateForm(false);
    refetch();
  }

  const stats = [
    { label: "Total accounts", value: userList.length, icon: Users, tone: "blue" },
    { label: "Active accounts", value: activeUsers, icon: UserRoundCheck, tone: "green" },
    { label: "Inactive accounts", value: inactiveUsers, icon: UserRoundX, tone: "slate" },
  ];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>ADMINISTRATION</p>
          <h1>User accounts</h1>
          <p className={styles.description}>
            Manage staff sign-in accounts, roles, and access status.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.refreshButton}
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setShowCreateForm(true)}
            disabled={loading}
          >
            + Create user
          </button>
        </div>
      </header>

      <section className={styles.statsGrid} aria-label="User account summary">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <article className={styles.statCard} key={label}>
            <span className={`${styles.statIcon} ${styles[`tone_${tone}`]}`}>
              <Icon size={18} aria-hidden="true" />
            </span>
            <span className={styles.statLabel}>{label}</span>
            <strong className={styles.statValue}>
              {loading ? "—" : value}
            </strong>
          </article>
        ))}
      </section>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.titleGroup}>
            <h2>Team accounts</h2>
            <span className={styles.count}>
              {loading ? "Loading…" : `${filteredUsers.length} accounts`}
            </span>
          </div>

          <div className={styles.filters}>
            <label className={styles.searchBox}>
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search users"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search user accounts"
              />
            </label>
            <select
              className={styles.filterSelect}
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              aria-label="Filter by role"
            >
              <option value="ALL">All roles</option>
              {roles.map((role) => <option key={role} value={role}>{role}</option>)}
            </select>
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by account status"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className={styles.message} role="alert">
            Could not load user accounts. {error.message}
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            loading={loading}
            onRowClick={setSelectedUser}
          />
        )}
      </section>

      {showCreateForm && (
        <Modal onClose={() => setShowCreateForm(false)}>
          <CreateUserForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>
      )}

      {selectedUser && (
        <UserDetailCard
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onStatusChange={refetch}
        />
      )}
    </main>
  );
}
