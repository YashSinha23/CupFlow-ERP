import styles from "./StockSummaryTable.module.css";

export default function StockSummaryTable({ materials }) {
  if (materials.length === 0) {
    return <p className={styles.emptyText}>No materials found.</p>;
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Material</th>
            <th>Available Stock</th>
            <th>Min Threshold</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material) => (
            <tr
              key={material.materialId}
              className={
                material.belowThreshold ? styles.belowThresholdRow : undefined
              }
            >
              <td>{material.materialType}</td>
              <td>
                {material.availableStock} {material.unit}
              </td>
              <td>
                {material.minThreshold} {material.unit}
              </td>
              <td>
                {material.belowThreshold ? (
                  <span className={styles.lowStockBadge}>Low Stock</span>
                ) : (
                  <span className={styles.okBadge}>OK</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
