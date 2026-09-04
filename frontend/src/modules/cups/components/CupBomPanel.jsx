import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import {
  getBomByCup,
  createBomEntry,
  updateBomEntry,
  deleteBomEntry,
} from "../../bom/api";
import { getMaterials } from "../../materials/api";
import styles from "./CupBomPanel.module.css";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { Skeleton } from "@chakra-ui/react";

export default function CupBomPanel({ cup }) {
  const {
    data: entries,
    loading,
    error,
    refetch,
  } = useFetch(() => getBomByCup(cup.id), [cup.id]);

  const { data: materials, loading: materialsLoading } = useFetch(
    () => getMaterials(),
    [],
  );

  const [showAddForm, setShowAddForm] = useState(false);

  if (loading) {
    return (
      <div className={styles.panel}>
        <div className={styles.toolbar}>
          {materialsLoading ? (
            <Skeleton height="38px" width="120px" />
          ) : (
            <button
              className={styles.addButton}
              onClick={() => setShowAddForm(true)}
            >
              + Add Material
            </button>
          )}
        </div>
        <div className={styles.entryList}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.entryRow}>
              <Skeleton height="18px" width="180px" />
              <Skeleton height="34px" width="90px" />
              <Skeleton height="18px" width="30px" />
              <Skeleton height="34px" width="50px" />
              <Skeleton height="34px" width="60px" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className={styles.error}>Error loading BOM: {error.message}</p>;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        {materialsLoading ? (
          <Skeleton height="38px" width="120px" />
        ) : (
          <button
            className={styles.addButton}
            onClick={() => setShowAddForm(true)}
          >
            + Add Material
          </button>
        )}
      </div>

      {showAddForm && (
        <AddBomEntryForm
          cup={cup}
          materials={materials}
          existingEntries={entries}
          onCancel={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            refetch();
          }}
        />
      )}

      {entries.length === 0 ? (
        <p className={styles.emptyState}>No BOM entries yet</p>
      ) : (
        <div className={styles.entryList}>
          {entries.map((entry) => (
            <BomEntryRow key={entry.id} entry={entry} onUpdated={refetch} />
          ))}
        </div>
      )}
    </div>
  );
}

function BomEntryRow({ entry, onUpdated }) {
  const [pendingQty, setPendingQty] = useState(entry.qtyPerUnit);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const hasChanges = Number(pendingQty) !== Number(entry.qtyPerUnit);

  async function handleSave() {
    if (!hasChanges || isSaving) return;

    setError(null);
    setIsSaving(true);

    try {
      await updateBomEntry(entry.id, { qtyPerUnit: Number(pendingQty) });
      onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setConfirmingDelete(false);
    setIsSaving(true);
    try {
      await deleteBomEntry(entry.id);
      onUpdated();
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.entryRow}>
      <span className={styles.materialName}>{entry.materialType}</span>
      <input
        className={styles.qtyInput}
        type="number"
        step="0.00001"
        value={pendingQty}
        disabled={isSaving}
        onChange={(e) => setPendingQty(e.target.value)}
      />
      <span className={styles.unit}>{entry.unit}</span>
      <button onClick={handleSave} disabled={!hasChanges || isSaving}>
        Save
      </button>
      <button onClick={() => setConfirmingDelete(true)} disabled={isSaving}>
        Delete
      </button>
      {error && <p className={styles.error}>{error}</p>}

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete BOM entry?"
          message={`Remove ${entry.materialType} from this cup's BOM. This can't be undone.`}
          confirmLabel="Delete"
          isDestructive
          onConfirm={handleDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}

function AddBomEntryForm({
  cup,
  materials,
  existingEntries,
  onCancel,
  onSuccess,
}) {
  const [materialId, setMaterialId] = useState("");
  const [qtyPerUnit, setQtyPerUnit] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usedMaterialIds = new Set(existingEntries.map((e) => e.materialId));
  const availableMaterials = materials.filter(
    (m) => !usedMaterialIds.has(m.id),
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await createBomEntry({
        cupId: cup.id,
        materialId,
        qtyPerUnit: Number(qtyPerUnit),
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.addForm} onSubmit={handleSubmit}>
      <select
        value={materialId}
        onChange={(e) => setMaterialId(e.target.value)}
        required
      >
        <option value="" disabled>
          Select material
        </option>
        {availableMaterials.map((m) => (
          <option key={m.id} value={m.id}>
            {m.materialType}
          </option>
        ))}
      </select>
      <input
        type="number"
        step="0.00001"
        placeholder="Qty per unit"
        value={qtyPerUnit}
        onChange={(e) => setQtyPerUnit(e.target.value)}
        required
      />
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.addFormActions}>
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}
