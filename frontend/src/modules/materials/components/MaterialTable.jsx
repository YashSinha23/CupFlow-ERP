import styles from "./MaterialTable.module.css";
import { Skeleton } from "@chakra-ui/react";

export default function MaterialTable({ materials, loading, onRowClick }) {
  if (loading) {
    return (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Material Type</th>
              <th>Unit</th>
              <th>Minimum Threshold</th>
              <th>Created At</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                <td>
                  <Skeleton height="18px" width="140px" />
                </td>
                <td>
                  <Skeleton height="18px" width="200px" />
                </td>
                <td>
                  <Skeleton height="18px" width="80px" />
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

  if (!materials || materials.length === 0) {
    return <p>No Materials Found.</p>;
  }
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Material Type</th>
            <th>Unit</th>
            <th>Minimum Threshold</th>
            <th>Created At</th>
          </tr>
        </thead>

        <tbody>
          {materials.map((material) => (
            <tr key={material.id} onClick={() => onRowClick?.(material)}>
              <td>{material.materialType}</td>
              <td>{material.unit}</td>
              <td>{material.minThreshold}</td>
              <td>{new Date(material.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
