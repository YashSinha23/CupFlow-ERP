import { useMemo, useState } from "react";
import { BriefcaseBusiness, RefreshCw, Search, UserPlus, Users, UserRoundCheck, UserRoundX } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import Modal from "../../components/Modal";
import { getEmployees } from "./api";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeDetailsPanel from "./components/EmployeeDetailsPanel";
import styles from "./Page.module.css";

const PAGE_SIZE = 8;

export default function EmployeesPage() {
  const { data, loading, error, refetch } = useFetch(getEmployees, []);
  const employees = useMemo(() => data ?? [], [data]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const departments = useMemo(
    () => [...new Set(employees.map((employee) => employee.department).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    return employees.filter((employee) => {
      const matchesSearch = !query || [
        employee.employeeCode,
        employee.fullName,
        employee.jobTitle,
        employee.department,
        employee.contactEmail,
        employee.contactPhone,
        employee.loginEmail,
      ].filter(Boolean).some((value) => value.toLowerCase().includes(query));
      const matchesDepartment = department === "ALL" || employee.department === department;
      const matchesStatus = status === "ALL" || employee.status === status;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [employees, search, department, status]);

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleEmployees = filteredEmployees.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeCount = employees.filter((employee) => employee.status === "ACTIVE").length;
  const inactiveCount = employees.length - activeCount;
  const linkedCount = employees.filter((employee) => employee.loginAccountLinked).length;

  function openCreate() {
    setEditingEmployee(null);
    setShowForm(true);
  }

  function openEdit(employee) {
    setSelectedEmployee(null);
    setEditingEmployee(employee);
    setShowForm(true);
  }

  function finishForm() {
    setShowForm(false);
    setEditingEmployee(null);
    refetch();
  }

  const stats = [
    { label: "Employees", value: employees.length, icon: Users, tone: "blue" },
    { label: "Active", value: activeCount, icon: UserRoundCheck, tone: "green" },
    { label: "Inactive", value: inactiveCount, icon: UserRoundX, tone: "slate" },
    { label: "Login accounts linked", value: linkedCount, icon: BriefcaseBusiness, tone: "teal" },
  ];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PEOPLE</p>
          <h1>Employees</h1>
          <p className={styles.description}>Manage employment records and optional CupFlow login access.</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.secondaryButton} onClick={refetch} disabled={loading}>
            <RefreshCw size={15} aria-hidden="true" /> Refresh
          </button>
          <button type="button" className={styles.primaryButton} onClick={openCreate}>
            <UserPlus size={16} aria-hidden="true" /> Add employee
          </button>
        </div>
      </header>

      <section className={styles.statsGrid} aria-label="Employee summary">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <article className={styles.statCard} key={label}>
            <span className={`${styles.statIcon} ${styles[`tone_${tone}`]}`}><Icon size={18} aria-hidden="true" /></span>
            <span className={styles.statLabel}>{label}</span>
            <strong className={styles.statValue}>{loading ? "—" : value}</strong>
          </article>
        ))}
      </section>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.panelTitle}>
            <h2>Employee directory</h2>
            <span>{loading ? "Loading…" : `${filteredEmployees.length} records`}</span>
          </div>
          <div className={styles.filters}>
            <label className={styles.searchBox}>
              <Search size={16} aria-hidden="true" />
              <input type="search" value={search} onChange={(event) => updateFilter(setSearch, event.target.value)} placeholder="Search employees" aria-label="Search employees" />
            </label>
            <select value={department} onChange={(event) => updateFilter(setDepartment, event.target.value)} aria-label="Filter by department">
              <option value="ALL">All departments</option>
              {departments.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={status} onChange={(event) => updateFilter(setStatus, event.target.value)} aria-label="Filter by employment status">
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className={styles.errorState} role="alert">
            <strong>Could not load employees</strong>
            <span>{error.message}</span>
            <button type="button" className={styles.retryButton} onClick={refetch}>Try again</button>
          </div>
        ) : (
          <EmployeeTable employees={visibleEmployees} loading={loading} onOpen={setSelectedEmployee} />
        )}

        {!error && !loading && filteredEmployees.length > PAGE_SIZE && (
          <div className={styles.pagination}>
            <span>Page {currentPage} of {pageCount}</span>
            <div>
              <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>Previous</button>
              <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount}>Next</button>
            </div>
          </div>
        )}
      </section>

      {showForm && (
        <Modal onClose={() => !loading && setShowForm(false)} wide>
          <EmployeeForm employee={editingEmployee} onSuccess={finishForm} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      {selectedEmployee && (
        <EmployeeDetailsPanel
          employee={selectedEmployee}
          employees={employees}
          onClose={() => setSelectedEmployee(null)}
          onEdit={openEdit}
          onUpdated={refetch}
        />
      )}
    </main>
  );
}
