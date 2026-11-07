import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { getCups } from "./api";
import Modal from "../../components/Modal";
import CupCard from "./components/CupCard";
import CreateCupForm from "./components/CreateCupForm";
import CupDetailModal from "./components/CupDetailModal";
import styles from "./Page.module.css";
import { Skeleton } from "@chakra-ui/react";

export default function Page() {
  const { data: cups, loading, error, refetch } = useFetch(getCups);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCup, setSelectedCup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const cupList = cups ?? [];
  const filteredCups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return cupList.filter((cup) => cup.cupName?.toLowerCase().includes(query));
  }, [cupList, searchTerm]);

  function handleCreateSuccess() {
    setShowCreateForm(false);
    refetch();
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>MANUFACTURING</p>
          <h1>Products</h1>
          <p className={styles.description}>
            Manage cup specifications and their bills of materials.
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
          >
            + Create cup
          </button>
        </div>
      </header>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.titleGroup}>
            <h2>Product catalog</h2>
            <span className={styles.count}>
              {loading ? "Loading…" : `${filteredCups.length} products`}
            </span>
          </div>
          <label className={styles.searchBox}>
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search products"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search products"
            />
          </label>
        </div>

        {error ? (
          <div className={styles.message} role="alert">
            Could not load products. {error.message}
          </div>
        ) : loading ? (
          <div className={styles.cupGrid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={styles.cupSkeleton}>
                <Skeleton height="72px" width="72px" borderRadius="12px" />
                <Skeleton height="18px" width="100px" />
              </div>
            ))}
          </div>
        ) : filteredCups.length === 0 ? (
          <div className={styles.emptyState}>No products match your search.</div>
        ) : (
          <div className={styles.cupGrid}>
            {filteredCups.map((cup) => (
              <CupCard key={cup.id} cup={cup} onClick={setSelectedCup} />
            ))}
          </div>
        )}
      </section>

      {showCreateForm && (
        <Modal onClose={() => setShowCreateForm(false)}>
          <CreateCupForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>
      )}

      {selectedCup && (
        <CupDetailModal
          cup={selectedCup}
          onClose={() => setSelectedCup(null)}
          onUpdated={refetch}
        />
      )}
    </main>
  );
}
