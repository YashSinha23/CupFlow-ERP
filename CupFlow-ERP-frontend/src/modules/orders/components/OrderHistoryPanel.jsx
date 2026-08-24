import { useFetch } from "../../../hooks/useFetch";
import { getOrderHistory } from "../api";
import styles from "./OrderHistoryPanel.module.css";

function formatStage(stage) {
    return stage.replaceAll("_", " ");
}

function formatDate(value) {
    return new Date(value).toLocaleString();
}

export default function OrderHistoryPanel({ orderId }) {
    const {
        data: history,
        loading,
        error,
    } = useFetch(
        () => getOrderHistory(orderId),
        [orderId]
    );

    if (loading) {
        return <p>Loading stage history...</p>;
    }

    if (error) {
        return (
            <p className={styles.error}>
                Error loading history: {error.message}
            </p>
        );
    }

    if (!history || history.length === 0) {
        return (
            <p className={styles.empty}>
                No stage history found.
            </p>
        );
    }

    return (
        <div className={styles.panel}>
            <div className={styles.historyList}>
                {history.map((entry) => (
                    <div
                        key={entry.id}
                        className={styles.historyItem}
                    >
                        <div className={styles.transition}>
                            <span>
                                {formatStage(entry.fromStage)}
                            </span>

                            <span className={styles.arrow}>
                                →
                            </span>

                            <strong>
                                {formatStage(entry.toStage)}
                            </strong>
                        </div>

                        <div className={styles.meta}>
                            <span>
                                Quantity:{" "}
                                {entry.quantityReported ?? "—"}
                            </span>

                            <span>
                                By:{" "}
                                {entry.performedByName}
                            </span>

                            <span>
                                {formatDate(entry.createdAt)}
                            </span>
                        </div>

                        {entry.notes && (
                            <p className={styles.notes}>
                                {entry.notes}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}