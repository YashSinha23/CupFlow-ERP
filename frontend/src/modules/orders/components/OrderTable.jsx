import styles from "./OrderTable.module.css";

function formatStage(stage) {
    return stage.replaceAll("_", " ");
}

function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

export default function OrderTable({ orders, onRowClick }) {
    if (!orders || orders.length === 0) {
        return <p className={styles.empty}>No Orders Found.</p>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Order Code</th>
                        <th>Customer</th>
                        <th>Cup</th>
                        <th>Quantity</th>
                        <th>Expected Delivery</th>
                        <th>Stage</th>
                        <th>Stock</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                        <tr
                            key={order.id}
                            onClick={() => onRowClick?.(order)}
                        >
                            <td>{order.orderCode}</td>

                            <td>{order.customerName}</td>

                            <td>{order.cupId}</td>

                            <td>{order.cupQuantity}</td>

                            <td>
                                {formatDate(order.expectedDelivery)}
                            </td>

                            <td>
                                <span className={styles.stageBadge}>
                                    {formatStage(order.currentStage)}
                                </span>
                            </td>

                            <td>
                                <span
                                    className={
                                        order.stockStatus === "CONFIRMED"
                                            ? styles.confirmed
                                            : styles.pending
                                    }
                                >
                                    {formatStage(order.stockStatus)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}