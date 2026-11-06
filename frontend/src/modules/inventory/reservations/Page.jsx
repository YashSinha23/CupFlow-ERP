import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { useFetch } from "../../../hooks/useFetch";
import { getStockReservations } from "../api";
import ReservationTable from "./components/ReservationTable";
import styles from "./Page.module.css";

const RESERVATION_STATUSES = ["ALL", "ACTIVE", "CONSUMED"];

export default function ReservationsPage() {
  const {
    data: reservations,
    loading,
    error,
    refetch,
  } = useFetch(getStockReservations);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredReservations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (reservations ?? []).filter((reservation) => {
      const matchesStatus =
        statusFilter === "ALL" || reservation.status === statusFilter;

      const searchableText = [
        reservation.materialType,
        reservation.status,
        reservation.orderId,
        reservation.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [reservations, search, statusFilter]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>INVENTORY</p>
          <h1>Reservations</h1>
          <p className={styles.description}>
            Track material reserved for orders and what has been consumed.
          </p>
        </div>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={refetch}
          disabled={loading}
        >
          <RefreshCw size={16} aria-hidden="true" />
          Refresh
        </button>
      </header>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.titleGroup}>
            <h2>Reservation records</h2>
            <span className={styles.count}>
              {loading
                ? "Loading…"
                : `${filteredReservations.length} records`}
            </span>
          </div>

          <div className={styles.filters}>
            <label className={styles.searchBox}>
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search reservations"
                aria-label="Search reservations"
              />
            </label>

            <select
              className={styles.statusFilter}
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by reservation status"
            >
              {RESERVATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "All statuses" : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className={styles.message} role="alert">
            Could not load reservations. {error.message}
          </div>
        ) : (
          <ReservationTable
            reservations={filteredReservations}
            loading={loading}
          />
        )}
      </section>
    </main>
  );
}
