import { useState } from "react";
import { createMaterial } from "../api";
import { MATERIAL_UNITS } from "../constants";
import styles from "./CreateMaterialForm.module.css";
import { notify } from "../../../lib/toast";

export default function CreateMaterialForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    materialType: "",
    unit: "",
    minThreshold: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createMaterial({
        materialType: form.materialType,
        unit: form.unit,
        minThreshold: Number(form.minThreshold),
      });
      notify.success("Material Created");
      onSuccess();
    } catch (error) {
      notify.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Create Material</h2>

      <div className={styles.fieldGroup}>
        <label htmlFor="materialType">Material Type</label>

        <input
          id="materialType"
          type="text"
          name="materialType"
          placeholder="Enter material type"
          value={form.materialType}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="unit">Unit</label>

        <select
          id="unit"
          name="unit"
          value={form.unit}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select unit
          </option>

          {MATERIAL_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="minThreshold">Minimum Threshold</label>

        <input
          id="minThreshold"
          type="number"
          name="minThreshold"
          placeholder="0.000"
          min="0"
          step="0.001"
          value={form.minThreshold}
          onChange={handleChange}
          required
        />
      </div>


      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Submit"}
        </button>
      </div>
    </form>
  );
}