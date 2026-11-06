import { Skeleton } from "@chakra-ui/react";
import styles from "./StockSummaryTable.module.css";

export default function StockSummaryTable({ materials, loading }) {
  if (loading) {
    return (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Material</th>
              <th>Available stock</th>
              <th>Minimum threshold</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td><Skeleton className={styles.skeletonCell} width="140px" /></td>
                <td><Skeleton className={styles.skeletonCell} width="110px" /></td>
                <td><Skeleton className={styles.skeletonCell} width="100px" /></td>
                <td><Skeleton className={styles.skeletonCell} width="72px" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className={styles.stateMessage}>
        No materials match your search.
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Material</th>
            <th>Available stock</th>
            <th>Minimum threshold</th>
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
              <td className={styles.materialName}>{material.materialType}</td>
              <td className={styles.quantity}>
                {material.availableStock} {material.unit}
              </td>
              <td>
                {material.minThreshold} {material.unit}
              </td>
              <td>
                <span
                  className={`${styles.badge} ${
                    material.belowThreshold
                      ? styles.lowStockBadge
                      : styles.okBadge
                  }`}
                >
                  {material.belowThreshold ? "Low stock" : "In stock"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
