import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, ListChecks, RefreshCw, Search, Users } from "lucide-react";
import { notify } from "../../lib/toast";
import { getShiftAssignments, getShiftDefinitions, getShiftEmployees, saveShiftAssignments } from "./api";
import { getMonthDates, getMonthWeeks, toDateInputValue } from "./dateUtils";
import ShiftAssignmentEditor from "./components/ShiftAssignmentEditor";
import ShiftFillToolbar from "./components/ShiftFillToolbar";
import ShiftScheduleGrid from "./components/ShiftScheduleGrid";
import styles from "./Page.module.css";

export default function ShiftSchedulePage() {
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("ALL");
  const [weekIndex, setWeekIndex] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedCells, setSelectedCells] = useState(() => new Map());
  const [savingBulk, setSavingBulk] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const year = month.getFullYear();
  const monthNumber = month.getMonth();
  const rangeStart = toDateInputValue(new Date(year, monthNumber, 1));
  const rangeEnd = toDateInputValue(new Date(year, monthNumber + 1, 0));
  const dates = useMemo(() => getMonthDates(year, monthNumber), [year, monthNumber]);
  const weeks = useMemo(() => getMonthWeeks(year, monthNumber), [year, monthNumber]);
  const weekDays = weeks[weekIndex] ?? weeks[0] ?? [];

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all([
      getShiftEmployees(),
      getShiftDefinitions(),
      getShiftAssignments(rangeStart, rangeEnd),
    ])
      .then(([employeeData, shiftData, assignmentData]) => {
        if (!active) return;
        setEmployees(employeeData ?? []);
        setShifts(shiftData ?? []);
        setAssignments(assignmentData ?? []);
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [rangeStart, rangeEnd, reloadKey]);

  const departments = useMemo(
    () => [...new Set(employees.map((employee) => employee.department).filter(Boolean))]
      .sort((left, right) => left.localeCompare(right)),
    [employees],
  );
  const visibleEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    return employees.filter((employee) => {
      const matchesSearch = !query || [employee.employeeCode, employee.fullName, employee.jobTitle, employee.department]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (department === "ALL" || employee.department === department);
    });
  }, [employees, search, department]);
  const assignmentsByKey = useMemo(() => new Map(
    assignments.map((assignment) => [`${assignment.employeeId}:${assignment.workDate}`, assignment]),
  ), [assignments]);
  const selectedKeys = useMemo(() => new Set(selectedCells.keys()), [selectedCells]);

  const scheduledDays = assignments.filter((assignment) => assignment.assignmentStatus === "SHIFT").length;
  const daysOff = assignments.filter((assignment) => assignment.assignmentStatus === "OFF").length;
  const cancelled = assignments.filter((assignment) => assignment.assignmentStatus === "CANCELLED").length;

  function moveMonth(amount) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
    setWeekIndex(0);
    setSelectionMode(false);
    setSelectedCells(new Map());
  }

  function refresh() {
    setReloadKey((value) => value + 1);
  }

  function finishSave() {
    setSelectedCell(null);
    refresh();
  }

  function handleGridSelect(cell) {
    if (!selectionMode) {
      setSelectedCell(cell);
      return;
    }
    const key = `${cell.employee.id}:${toDateInputValue(cell.date)}`;
    setSelectedCells((current) => {
      const next = new Map(current);
      if (next.has(key)) next.delete(key);
      else next.set(key, { employee: cell.employee, date: cell.date });
      return next;
    });
  }

  async function applyToSelection(status, shiftId) {
    if (!selectedCells.size || savingBulk) return;
    setSavingBulk(true);
    const payload = [...selectedCells.values()].map(({ employee, date }) => ({
      employeeId: employee.id,
      workDate: toDateInputValue(date),
      assignmentStatus: status,
      shiftId: status === "SHIFT" ? shiftId : null,
    }));
    try {
      await saveShiftAssignments(payload);
      notify.success(`${payload.length} schedule cell${payload.length === 1 ? "" : "s"} updated.`);
      setSelectedCells(new Map());
      setSelectionMode(false);
      refresh();
    } catch (saveError) {
      notify.error(saveError.message);
    } finally {
      setSavingBulk(false);
    }
  }

  function toggleSelectionMode() {
    if (selectionMode) setSelectedCells(new Map());
    setSelectionMode((current) => !current);
  }

  const monthLabel = month.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>PEOPLE</p>
          <h1>Shift schedule</h1>
          <p className={styles.description}>Plan daily shifts for active employees across the production team.</p>
        </div>
        <button type="button" className={styles.refreshButton} onClick={refresh} disabled={loading}>
          <RefreshCw size={15} aria-hidden="true" /> Refresh
        </button>
      </header>

      <section className={styles.statsGrid} aria-label="Schedule summary">
        <article className={styles.statCard}>
          <span className={`${styles.statIcon} ${styles.toneBlue}`}><Users size={18} aria-hidden="true" /></span>
          <span className={styles.statLabel}>Active employees</span>
          <strong>{loading ? "—" : employees.length}</strong>
        </article>
        <article className={styles.statCard}>
          <span className={`${styles.statIcon} ${styles.toneGreen}`}><CalendarDays size={18} aria-hidden="true" /></span>
          <span className={styles.statLabel}>Scheduled days</span>
          <strong>{loading ? "—" : scheduledDays}</strong>
        </article>
        <article className={styles.statCard}>
          <span className={`${styles.statIcon} ${styles.toneSlate}`}><Clock3 size={18} aria-hidden="true" /></span>
          <span className={styles.statLabel}>Days off</span>
          <strong>{loading ? "—" : daysOff}</strong>
        </article>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelToolbar}>
          <div className={styles.monthControls}>
            <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month"><ChevronLeft size={17} /></button>
            <h2>{monthLabel}</h2>
            <button type="button" onClick={() => moveMonth(1)} aria-label="Next month"><ChevronRight size={17} /></button>
          </div>
          <div className={styles.filters}>
            <label className={styles.searchBox}>
              <Search size={15} aria-hidden="true" />
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employees" aria-label="Search employees" />
            </label>
            <select value={department} onChange={(event) => setDepartment(event.target.value)} aria-label="Filter by department">
              <option value="ALL">All departments</option>
              {departments.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className={styles.weekControls}>
            <button type="button" onClick={() => setWeekIndex((value) => Math.max(0, value - 1))} disabled={weekIndex === 0} aria-label="Previous week"><ChevronLeft size={16} /></button>
            <span>Week {weekIndex + 1} of {weeks.length}</span>
            <button type="button" onClick={() => setWeekIndex((value) => Math.min(weeks.length - 1, value + 1))} disabled={weekIndex >= weeks.length - 1} aria-label="Next week"><ChevronRight size={16} /></button>
          </div>
          <button type="button" className={`${styles.selectionButton} ${selectionMode ? styles.selectionButtonActive : ""}`} onClick={toggleSelectionMode}>
            <ListChecks size={15} aria-hidden="true" />{selectionMode ? "Done selecting" : "Select cells"}
          </button>
        </div>

        {selectionMode && (
          <ShiftFillToolbar
            shifts={shifts}
            selectedCount={selectedCells.size}
            saving={savingBulk}
            onApply={applyToSelection}
            onClear={() => setSelectedCells(new Map())}
          />
        )}

        <div className={styles.legend} aria-label="Shift status legend">
          <span><i className={styles.legendShift} /> Shift</span>
          <span><i className={styles.legendOff} /> Day off</span>
          <span><i className={styles.legendCancelled} /> Cancelled</span>
          <small>{cancelled} cancelled in this month</small>
        </div>

        {!loading && !error && shifts.length === 0 && (
          <div className={styles.templateWarning} role="status">
            No shift templates were returned. Check that the five shift rows exist in the database this frontend is connected to.
          </div>
        )}

        {error ? (
          <div className={styles.errorState} role="alert">
            <strong>Could not load the shift schedule</strong>
            <span>{error.message}</span>
            <button type="button" onClick={refresh}>Try again</button>
          </div>
        ) : loading ? (
          <div className={styles.loadingState}>Loading schedule…</div>
        ) : (
          <ShiftScheduleGrid
            employees={visibleEmployees}
            dates={dates}
            weekDays={weekDays}
            assignmentsByKey={assignmentsByKey}
            selectionMode={selectionMode}
            selectedKeys={selectedKeys}
            onSelect={handleGridSelect}
          />
        )}
      </section>

      {selectedCell && (
        <ShiftAssignmentEditor
          cell={selectedCell}
          shifts={shifts}
          onClose={() => setSelectedCell(null)}
          onSaved={finishSave}
        />
      )}
    </main>
  );
}
