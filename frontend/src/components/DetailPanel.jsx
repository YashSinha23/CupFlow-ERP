import styles from "./DetailPanel.module.css";

export default function DetailPanel({ onClose, children }) {
    return (
        <div className={styles.backdrop} onMouseDown={onClose}>
            <aside className={styles.panel} onMouseDown={(e) => e.stopPropagation()}>
                {children}
            </aside>
        </div>
    );
}