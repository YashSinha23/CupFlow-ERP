import styles from "./StockSummaryTable.module.css";
import { Skeleton } from "@chakra-ui/react";

export default function StockSummaryTable({ materials, loading }) {
  if (loading) {
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
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                <td>
                  <Skeleton height="18px" width="140px" />
                </td>
                <td>
                  <Skeleton height="18px" width="120px" />
                </td>
                <td>
                  <Skeleton height="18px" width="100px" />
                </td>
                <td>
                  <Skeleton height="24px" width="70px" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

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
