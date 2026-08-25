import { useState } from "react";
import { updateMaterial } from "../api";
import { MATERIAL_UNITS } from "../constants";
import DetailPanel from "../../../components/DetailPanel";
import styles from "./MaterialDetailsCard.module.css";
import { notify } from "../../../lib/toast";

export default function MaterialDetailsCard({ material, onClose, onUpdated }) {
    const [pendingUnit, setPendingUnit] = useState(material.unit);
    const [pendingMinThreshold, setPendingMinThreshold] = useState(material.minThreshold);
    const [isSaving, setIsSaving] = useState(false);

    const hasChanges =
        pendingUnit !== material.unit ||
        Number(pendingMinThreshold) !== Number(material.minThreshold);

    async function handleSave() {
        if (!hasChanges || isSaving) return;

        setIsSaving(true);

        try {
            await updateMaterial(material.id, {
                unit: pendingUnit,
                minThreshold: Number(pendingMinThreshold),
            });
            notify.success("Material Updated.");
            onUpdated();
            onClose();
        } catch (err) {
            notify.error(err.message);
            setIsSaving(false);
        }
    }

    return (
        <DetailPanel onClose={onClose}>
            <div className={styles.header}>
                <h2 className={styles.title}>Material Details</h2>
                <button className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>
            </div>

            <div className={styles.infoSection}>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Material Type</span>
                    <span className={styles.infoValue}>{material.materialType}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Created At</span>
                    <span className={styles.infoValue}>{new Date(material.createdAt).toLocaleString()}</span>
                </div>
            </div>

            <div className={styles.editSection}>
                <div className={styles.fieldGroup}>
                    <label htmlFor="unit">Unit</label>
                    <select
                        id="unit"
                        value={pendingUnit}
                        disabled={isSaving}
                        onChange={(e) => setPendingUnit(e.target.value)}
                    >
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
                        min="0"
                        step="0.001"
                        value={pendingMinThreshold}
                        disabled={isSaving}
                        onChange={(e) => setPendingMinThreshold(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.footer}>
                <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>
        </DetailPanel>
    );
}