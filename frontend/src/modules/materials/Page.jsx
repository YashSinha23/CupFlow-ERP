import { useMemo, useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { getMaterials } from "./api";
import MaterialTable from "./components/MaterialTable";
import CreateMaterialForm from "./components/CreateMaterialForm";
import MaterialDetailsCard from "./components/MaterialDetailsCard";
import Modal from "../../components/Modal";
import styles from "./Page.module.css";

export default function Page() {
  const { data: materials, loading, error, refetch } = useFetch(getMaterials);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const materialList = materials ?? [];
  const filteredMaterials = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return materialList.filter((material) =>
      material.materialType?.toLowerCase().includes(query),
    );
  }, [materialList, searchTerm]);

  function handleCreateSuccess() {
    setShowCreateForm(false);
    refetch();
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>MANUFACTURING</p>
          <h1>Materials</h1>
          <p className={styles.description}>
            Manage raw materials and the stock levels used in production.
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
            + Create material
          </button>
        </div>
      </header>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.titleGroup}>
            <h2>Material catalog</h2>
            <span className={styles.count}>
              {loading ? "Loading…" : `${filteredMaterials.length} materials`}
            </span>
          </div>
          <label className={styles.searchBox}>
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search materials"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search materials"
            />
          </label>
        </div>

        {error ? (
          <div className={styles.message} role="alert">
            Could not load materials. {error.message}
          </div>
        ) : (
          <MaterialTable
            materials={filteredMaterials}
            loading={loading}
            onRowClick={setSelectedMaterial}
          />
        )}
      </section>

      {showCreateForm && (
        <Modal onClose={() => setShowCreateForm(false)}>
          <CreateMaterialForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>
      )}

      {selectedMaterial && (
        <MaterialDetailsCard
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
          onUpdated={refetch}
        />
      )}
    </main>
  );
}
