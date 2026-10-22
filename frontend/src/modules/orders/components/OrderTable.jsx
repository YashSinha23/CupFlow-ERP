import styles from "./OrderTable.module.css";

function formatStage(value = "") {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  if (!value) return "—";

  // Treat the API's YYYY-MM-DD date as a local calendar date.
  return new Date(`${value}T00:00:00`).toLocaleDateString();
}

function getStageClass(stage) {
  if (stage === "READY_TO_DISPATCH") return styles.readyStage;
  if (stage === "DISPATCHED") return styles.dispatchedStage;
  if (stage === "ORDER_RECEIVED") return styles.receivedStage;
  return styles.inProgressStage;
}

export default function OrderTable({ orders, onRowClick, openingOrderId }) {
  if (!orders || orders.length === 0) {
    return <p className={styles.empty}>No orders found.</p>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Order</th>
            <th scope="col">Customer</th>
            <th scope="col">Quantity</th>
            <th scope="col">Expected delivery</th>
            <th scope="col">Production stage</th>
            <th scope="col">Material status</th>
            <th scope="col">
              <span className={styles.visuallyHidden}>Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <span className={styles.orderCode}>{order.orderCode}</span>
              </td>

              <td>
                <span className={styles.customerName}>
                  {order.customerName}
                </span>
              </td>

              <td>{Number(order.cupQuantity).toLocaleString()}</td>

              <td>{formatDate(order.expectedDelivery)}</td>

              <td>
                <span
                  className={`${styles.statusBadge} ${getStageClass(
                    order.currentStage,
                  )}`}
                >
                  {formatStage(order.currentStage)}
                </span>
              </td>

              <td>
                <span
                  className={`${styles.statusBadge} ${
                    order.stockStatus === "CONFIRMED"
                      ? styles.confirmedStatus
                      : styles.pendingStatus
                  }`}
                >
                  {formatStage(order.stockStatus)}
                </span>
              </td>

              <td className={styles.actionCell}>
                <button
                  type="button"
                  className={styles.viewButton}
                  onClick={() => onRowClick?.(order)}
                  disabled={Boolean(openingOrderId)}
                  aria-busy={openingOrderId === order.id}
                  aria-label={`View order ${order.orderCode}`}
                >
                  {openingOrderId === order.id ? "Opening…" : "View"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
