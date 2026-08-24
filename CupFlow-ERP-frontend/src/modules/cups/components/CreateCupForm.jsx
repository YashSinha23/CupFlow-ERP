import { useState } from "react";
import { createCup } from "../api";
import styles from "./CreateCupForm.module.css"
import { notify } from "../../../lib/toast";

export default function CreateCupForm({ onSuccess, onCancel }) {
    const [form, setForm] = useState({
        cupName: "",
        cavity: "",
        diameter: "",
        height: "",
        lipSize: "",
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
            await createCup({
                cupName: form.cupName,
                cavity: Number(form.cavity),
                diameter: Number(form.diameter),
                height: Number(form.height),
                lipSize: Number(form.lipSize),
            });
            notify.success("Cup created.");
            onSuccess();
        } catch (err) {
            notify.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.title}>Create Cup</h2>

            <div className={styles.fieldGroup}>
                <label>Cup Name</label>
                <input
                    id="cupName"
                    type="text"
                    name="cupName"
                    placeholder="Enter Cup name"
                    value={form.cupName}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Cavity</label>
                <input
                    id="cavity"
                    type="number"
                    name="cavity"
                    placeholder="Enter Cavity"
                    value={form.cavity}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Diameter (mm)</label>
                <input
                    id="diameter"
                    type="number"
                    step="0.01"
                    name="diameter"
                    placeholder="Enter Diameter"
                    value={form.diameter}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Height (mm)</label>
                <input
                    id="height"
                    type="number"
                    step="0.01"
                    name="height"
                    placeholder="Enter Height"
                    value={form.height}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label>Lip Size (mm)</label>
                <input
                    id="lipSize"
                    type="number"
                    step="0.01"
                    name="lipSize"
                    placeholder="Enter Lip Size"
                    value={form.lipSize}
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