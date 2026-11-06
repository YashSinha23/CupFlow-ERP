import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { useFetch } from "../../../hooks/useFetch";
import { getStockMovements } from "../api";
import StockMovementTable from "./components/StockMovementTable";
import styles from "./Page.module.css";

const MOVEMENT_TYPES = ["ALL", "STOCK_IN", "RESERVED", "CONSUMED"];

export default function StockMovementsPage() {
  const {
    data: movements,
    loading,
    error,
    refetch,
  } = useFetch(getStockMovements);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const filteredMovements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return (movements ?? []).filter((movement) => {
      const matchesType =
        typeFilter === "ALL" || movement.movementType === typeFilter;

      const searchableText = [
        movement.materialType,
        movement.movementType,
        movement.orderId,
        movement.supplierName,
        movement.performedBy,
        movement.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesType && searchableText.includes(query);
    });
  }, [movements, search, typeFilter]);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>INVENTORY</p>
          <h1>Stock movements</h1>
          <p className={styles.description}>
            Review stock received, reserved, and consumed.
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
            <h2>Movement history</h2>
            <span className={styles.count}>
              {loading ? "Loading…" : `${filteredMovements.length} entries`}
            </span>
          </div>

          <div className={styles.filters}>
            <label className={styles.searchBox}>
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search movements"
                aria-label="Search stock movements"
              />
            </label>

            <select
              className={styles.typeFilter}
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter by movement type"
            >
              {MOVEMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === "ALL" ? "All types" : type.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? (
          <div className={styles.message} role="alert">
            Could not load stock movements. {error.message}
          </div>
        ) : (
          <StockMovementTable
            movements={filteredMovements}
            loading={loading}
          />
        )}
      </section>
    </main>
  );
}
