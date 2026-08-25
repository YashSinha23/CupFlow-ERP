import styles from "./MaterialTable.module.css"

export default function MaterialTable({ materials, onRowClick }) {
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