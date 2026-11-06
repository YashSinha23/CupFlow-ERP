import styles from "./ReservationTable.module.css";

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

export default function ReservationTable({ reservations, loading }) {
  if (loading) {
    return <div className={styles.stateMessage}>Loading reservations…</div>;
  }

  if (reservations.length === 0) {
    return (
      <div className={styles.stateMessage}>
        No reservations match your filters.
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Reserved</th>
            <th>Order ID</th>
            <th>Material</th>
            <th>Reserved quantity</th>
            <th>Status</th>
            <th>Consumed</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.id}>
              <td>{formatDate(reservation.createdAt)}</td>
              <td title={reservation.orderId ?? ""}>
                {shortId(reservation.orderId)}
              </td>
              <td className={styles.material}>
                {reservation.materialType}
                <span>{reservation.unit}</span>
              </td>
              <td className={styles.quantity}>
                {quantityFormatter.format(Number(reservation.reservedQty))}{" "}
                {reservation.unit}
              </td>
              <td>
                <span
                  className={`${styles.badge} ${
                    reservation.status === "ACTIVE"
                      ? styles.active
                      : styles.consumed
                  }`}
                >
                  {reservation.status === "ACTIVE" ? "Active" : "Consumed"}
                </span>
              </td>
              <td>{formatDate(reservation.consumedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
