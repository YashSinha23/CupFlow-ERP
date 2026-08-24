import { useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { getCups } from "../../cups/api";
import { createOrder } from "../api";
import { notify } from "../../../lib/toast";
import styles from "./CreateOrderForm.module.css";

export default function CreateOrderForm({ onSuccess, onCancel }) {
    const {
        data: cups,
        loading: cupsLoading,
        error: cupsError,
    } = useFetch(() => getCups(), []);

    const [customerName, setCustomerName] = useState("");
    const [cupId, setCupId] = useState("");
    const [cupQuantity, setCupQuantity] = useState("");
    const [expectedDelivery, setExpectedDelivery] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            await createOrder({
                customerName,
                cupId,
                cupQuantity: Number(cupQuantity),
                expectedDelivery,
            });

            notify.success("Order Created");
            onSuccess();
        } catch (error) {
            notify.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
        >
            <h2 className={styles.title}>Create Order</h2>

            <div className={styles.fieldGroup}>
                <label htmlFor="customerName">
                    Customer Name
                </label>

                <input
                    id="customerName"
                    type="text"
                    value={customerName}
                    onChange={(e) =>
                        setCustomerName(e.target.value)
                    }
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="cupId">
                    Cup
                </label>

                <select
                    id="cupId"
                    value={cupId}
                    onChange={(e) => setCupId(e.target.value)}
                    disabled={cupsLoading}
                    required
                >
                    <option value="" disabled>
                        {cupsLoading
                            ? "Loading cups..."
                            : "Select cup"}
                    </option>

                    {cups?.map((cup) => (
                        <option
                            key={cup.id}
                            value={cup.id}
                        >
                            {cup.cupName}
                        </option>
                    ))}
                </select>

                {cupsError && (
                    <p className={styles.error}>
                        Failed to load cups.
                    </p>
                )}
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="cupQuantity">
                    Cup Quantity
                </label>

                <input
                    id="cupQuantity"
                    type="number"
                    min="1"
                    value={cupQuantity}
                    onChange={(e) =>
                        setCupQuantity(e.target.value)
                    }
                    required
                />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="expectedDelivery">
                    Expected Delivery
                </label>

                <input
                    id="expectedDelivery"
                    type="date"
                    value={expectedDelivery}
                    onChange={(e) =>
                        setExpectedDelivery(e.target.value)
                    }
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
                    {isSubmitting ? "Creating..." : "Create"}
                </button>
            </div>
        </form>
    );
}