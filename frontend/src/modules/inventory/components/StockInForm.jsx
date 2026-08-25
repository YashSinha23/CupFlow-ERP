import { useState } from "react";
import { stockIn } from "../api";
import { notify } from "../../../lib/toast";
import styles from "./StockInForm.module.css";

export default function StockInForm({ materials, onSuccess, onCancel }) {
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!materialId) {
      setError("Please select a material.");
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await stockIn({
        materialId,
        quantity: Number(quantity),
        supplierName: supplierName || null,
        notes: notes || null,
      });

      notify.success("Stock recorded successfully");
      onSuccess();
    } catch (err) {
      setError(err.message || "Failed to record stock. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Add Stock</h2>

      <div className={styles.fieldGroup}>
        <label htmlFor="materialId">Material</label>
        <select
          id="materialId"
          value={materialId}
          onChange={(e) => setMaterialId(e.target.value)}
          disabled={isSaving}
        >
          <option value="">Select a material</option>
          {materials.map((material) => (
            <option key={material.materialId} value={material.materialId}>
              {material.materialType}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          step="0.001"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={isSaving}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="supplierName">Supplier Name</label>
        <input
          id="supplierName"
          type="text"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          disabled={isSaving}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isSaving}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>
        <button type="submit" className={styles.submitButton} disabled={isSaving}>
          {isSaving ? "Saving..." : "Add Stock"}
        </button>
      </div>
    </form>
  );
}