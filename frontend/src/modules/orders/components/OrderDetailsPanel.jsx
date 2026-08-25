import styles from "./OrderDetailsPanel.module.css";

function formatStage(value) {
  return value.replaceAll("_", " ");
}

function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

export default function OrderDetailsPanel({ order }) {
  return (
    <div className={styles.panel}>
      <div className={styles.grid}>
        <div className={styles.item}>
          <span>Customer</span>
          <strong>{order.customerName}</strong>
        </div>

        <div className={styles.item}>
          <span>Cup ID</span>
          <strong>{order.cupId}</strong>
        </div>

        <div className={styles.item}>
          <span>Quantity</span>
          <strong>{order.cupQuantity}</strong>
        </div>

        <div className={styles.item}>
          <span>Expected Delivery</span>
          <strong>{formatDate(order.expectedDelivery)}</strong>
        </div>

        <div className={styles.item}>
          <span>Current Stage</span>
          <strong>{formatStage(order.currentStage)}</strong>
        </div>

        <div className={styles.item}>
          <span>Stock Status</span>
          <strong>{formatStage(order.stockStatus)}</strong>
        </div>

        <div className={styles.item}>
          <span>Created By</span>
          <strong>{order.createdByName}</strong>
        </div>

        <div className={styles.item}>
          <span>Created At</span>
          <strong>{formatDate(order.createdAt)}</strong>
        </div>
      </div>

      {order.stockStatus === "PENDING_STOCK" &&
        order.shortfalls?.length > 0 && (
          <div className={styles.shortfallSection}>
            <h3>Stock Shortage</h3>

            <table className={styles.shortfallTable}>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Required</th>
                  <th>Available</th>
                  <th>Unit</th>
                </tr>
              </thead>

              <tbody>
                {order.shortfalls.map((item, index) => (
                  <tr key={index}>
                    <td>{item.materialType}</td>
                    <td>{item.required}</td>
                    <td>{item.available}</td>
                    <td>{item.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}