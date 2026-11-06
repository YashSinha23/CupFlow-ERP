import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import Modal from "../../components/Modal";
import { getStockSummary } from "./api";
import StockSummaryTable from "./components/StockSummaryTable";
import StockInForm from "./components/StockInForm";
import styles from "./Inventory.module.css";

export default function InventoryPage() {
  const {
    data: stockSummary,
    loading,
    error,
    refetch,
  } = useFetch(getStockSummary);

  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const materials = stockSummary ?? [];
  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return materials;

    return materials.filter((material) =>
      material.materialType?.toLowerCase().includes(query),
    );
  }, [materials, search]);

  const handleStockInSuccess = () => {
    setIsAddStockModalOpen(false);
    refetch();
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>INVENTORY</p>
          <h1>Stock overview</h1>
          <p className={styles.description}>
            Monitor available material stock and low-stock thresholds.
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
            className={styles.addStockButton}
            onClick={() => setIsAddStockModalOpen(true)}
            disabled={loading}
          >
            + Add stock
          </button>
        </div>
      </header>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.titleGroup}>
            <h2>Current stock</h2>
            <span className={styles.count}>
              {loading
                ? "Loading…"
                : `${filteredMaterials.length} materials`}
            </span>
          </div>

          <label className={styles.searchBox}>
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search materials"
              aria-label="Search inventory materials"
            />
          </label>
        </div>

        {error ? (
          <div className={styles.errorMessage} role="alert">
            Could not load stock overview. {error.message}
          </div>
        ) : (
          <StockSummaryTable
            loading={loading}
            materials={filteredMaterials}
          />
        )}
      </section>

      {isAddStockModalOpen && (
        <Modal onClose={() => setIsAddStockModalOpen(false)}>
          <StockInForm
            materials={materials}
            onSuccess={handleStockInSuccess}
            onCancel={() => setIsAddStockModalOpen(false)}
          />
        </Modal>
      )}
    </main>
  );
}
