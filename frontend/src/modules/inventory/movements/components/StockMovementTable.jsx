import styles from "./StockMovementTable.module.css";

const quantityFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 3,
});

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function shortId(value) {
  return value ? value.slice(0, 8) : "—";
}

function movementLabel(type) {
  return type?.replaceAll("_", " ") ?? "Unknown";
}

export default function StockMovementTable({ movements, loading }) {
  if (loading) {
    return <div className={styles.stateMessage}>Loading movements…</div>;
  }

  if (movements.length === 0) {
    return (
      <div className={styles.stateMessage}>
        No stock movements match your filters.
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Material</th>
            <th>Movement</th>
            <th>Quantity</th>
            <th>Order ID</th>
            <th>Supplier</th>
            <th>Recorded by</th>
            <th>Notes</th>
          </tr>
        </thead>

        <tbody>
          {movements.map((movement) => {
            const quantity = Number(movement.quantity);
            const quantityClass =
              quantity < 0 ? styles.negative : styles.positive;

            return (
              <tr key={movement.id}>
                <td>{formatDate(movement.createdAt)}</td>
                <td className={styles.material}>
                  {movement.materialType}
                  <span>{movement.unit}</span>
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      styles[movement.movementType?.toLowerCase()] ?? ""
                    }`}
                  >
                    {movementLabel(movement.movementType)}
                  </span>
                </td>
                <td className={quantityClass}>
                  {quantityFormatter.format(quantity)} {movement.unit}
                </td>
                <td title={movement.orderId ?? ""}>
                  {shortId(movement.orderId)}
                </td>
                <td>{movement.supplierName || "—"}</td>
                <td title={movement.performedBy ?? ""}>
                  {shortId(movement.performedBy)}
                </td>
                <td className={styles.notes} title={movement.notes ?? ""}>
                  {movement.notes || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
