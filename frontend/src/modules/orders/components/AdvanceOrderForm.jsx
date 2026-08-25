import { useState } from "react";
import { advanceOrder } from "../api";
import { notify } from "../../../lib/toast";
import styles from "./AdvanceOrderForm.module.css";

export default function AdvanceOrderForm({
    orders,
    onSuccess,
    onCancel,
}) {
    const [orderId, setOrderId] = useState("");
    const [quantityReported, setQuantityReported] = useState("");
    const [notes, setNotes] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedOrder = orders.find(
        (order) => order.id === orderId
    );

    async function handleSubmit(e) {
        e.preventDefault();

        if (isSubmitting || !selectedOrder) return;

        setIsSubmitting(true);

        try {
            await advanceOrder(orderId, {
                quantityReported:
                    quantityReported === ""
                        ? null
                        : Number(quantityReported),
                notes: notes || null,
            });

            notify.success("Order advanced successfully");
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
            <h2 className={styles.title}>
                Advance Order
            </h2>

            <div className={styles.fieldGroup}>
                <label htmlFor="orderId">
                    Select Order
                </label>

                <select
                    id="orderId"
                    value={orderId}
                    onChange={(e) =>
                        setOrderId(e.target.value)
                    }
                    required
                    disabled={isSubmitting}
                >
                    <option value="" disabled>
                        Select active order
                    </option>

                    {orders.map((order) => (
                        <option
                            key={order.id}
                            value={order.id}
                        >
                            {order.orderCode} —{" "}
                            {order.customerName}
                        </option>
                    ))}
                </select>
            </div>

            {selectedOrder && (
                <>
                    <div className={styles.infoRow}>
                        <span>Current Stage</span>
                        <strong>
                            {selectedOrder.currentStage.replaceAll(
                                "_",
                                " "
                            )}
                        </strong>
                    </div>

                    <div className={styles.infoRow}>
                        <span>Quantity</span>
                        <strong>
                            {selectedOrder.cupQuantity}
                        </strong>
                    </div>
                </>
            )}

            <div className={styles.fieldGroup}>
                <label htmlFor="quantityReported">
                    Quantity Reported
                </label>

                <input
                    id="quantityReported"
                    type="number"
                    min="1"
                    value={quantityReported}
                    onChange={(e) =>
                        setQuantityReported(e.target.value)
                    }
                    disabled={isSubmitting}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="notes">
                    Notes
                </label>

                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) =>
                        setNotes(e.target.value)
                    }
                    disabled={isSubmitting}
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
                    disabled={
                        isSubmitting || !selectedOrder
                    }
                >
                    {isSubmitting
                        ? "Advancing..."
                        : "Advance"}
                </button>
            </div>
        </form>
    );
}