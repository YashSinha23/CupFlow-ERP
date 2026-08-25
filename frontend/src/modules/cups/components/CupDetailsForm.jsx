import { useState } from "react";
import { updateCup } from "../api";
import styles from "./CupDetailsForm.module.css";

export default function CupDetailsForm({ cup, onUpdated }) {
    const [pendingCupName, setPendingCupName] = useState(cup.cupName);
    const [pendingCavity, setPendingCavity] = useState(cup.cavity);
    const [pendingDiameter, setPendingDiameter] = useState(cup.diameter);
    const [pendingHeight, setPendingHeight] = useState(cup.height);
    const [pendingLipSize, setPendingLipSize] = useState(cup.lipSize);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const hasChanges =
        pendingCupName !== cup.cupName ||
        Number(pendingCavity) !== Number(cup.cavity) ||
        Number(pendingDiameter) !== Number(cup.diameter) ||
        Number(pendingHeight) !== Number(cup.height) ||
        Number(pendingLipSize) !== Number(cup.lipSize);

    async function handleSave() {
        if (!hasChanges || isSaving) return;

        setError(null);
        setIsSaving(true);

        try {
            await updateCup(cup.id, {
                cupName: pendingCupName,
                cavity: Number(pendingCavity),
                diameter: Number(pendingDiameter),
                height: Number(pendingHeight),
                lipSize: Number(pendingLipSize),
            });
            onUpdated();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className={styles.form}>
            <div className={styles.fieldGroup}>
                <label>Cup Name</label>
                <input
                    type="text"
                    value={pendingCupName}
                    disabled={isSaving}
                    onChange={(e) => setPendingCupName(e.target.value)}
                />
            </div>
            <div className={styles.fieldGroup}>
                <label>Cavity</label>
                <input
                    type="number"
                    value={pendingCavity}
                    disabled={isSaving}
                    onChange={(e) => setPendingCavity(e.target.value)}
                />
            </div>
            <div className={styles.fieldGroup}>
                <label>Diameter (mm)</label>
                <input
                    type="number"
                    step="0.01"
                    value={pendingDiameter}
                    disabled={isSaving}
                    onChange={(e) => setPendingDiameter(e.target.value)}
                />
            </div>
            <div className={styles.fieldGroup}>
                <label>Height (mm)</label>
                <input
                    type="number"
                    step="0.01"
                    value={pendingHeight}
                    disabled={isSaving}
                    onChange={(e) => setPendingHeight(e.target.value)}
                />
            </div>
            <div className={styles.fieldGroup}>
                <label>Lip Size (mm)</label>
                <input
                    type="number"
                    step="0.01"
                    value={pendingLipSize}
                    disabled={isSaving}
                    onChange={(e) => setPendingLipSize(e.target.value)}
                />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
            >
                {isSaving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}