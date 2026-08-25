import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { getCups } from "./api";
import Modal from "../../components/Modal";
import CupCard from "./components/CupCard";
import CreateCupForm from "./components/CreateCupForm";
import styles from "./Page.module.css";
import CupDetailModal from "./components/CupDetailModal";

export default function Page() {
  const { data: cups, loading, error, refetch } = useFetch(() => getCups(), []);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCup, setSelectedCup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  function handleCreateSuccess() {
    setShowCreateForm(false);
    refetch();
  }

  if (loading) {
    return <p>Loading Cups</p>;
  }

  if (error) {
    return <p>Error loading Cups: {error.message}</p>;
  }

  const filteredCups = cups.filter((cup) =>
    cup.cupName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h1>Cups</h1>
        </div>

        <div className={styles.toolbar}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search cups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className={styles.createButton}
            onClick={() => setShowCreateForm(true)}
          >
            + Create Cup
          </button>
        </div>

        {showCreateForm && (
          <Modal onClose={() => setShowCreateForm(false)}>
            <CreateCupForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </Modal>
        )}

        {filteredCups.length === 0 ? (
          <p className={styles.emptyState}>No Cups Found</p>
        ) : (
          <div className={styles.cupGrid}>
            {filteredCups.map((cup) => (
              <CupCard key={cup.id} cup={cup} onClick={setSelectedCup} />
            ))}
          </div>
        )}

        {selectedCup && (
          <CupDetailModal
            cup={selectedCup}
            onClose={() => setSelectedCup(null)}
            onUpdated={refetch}
          />
        )}
      </div>
    </div>
  );
}
