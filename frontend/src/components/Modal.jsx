import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export default function Modal({ onClose, children, wide = false }) {
    return createPortal(
        <div className={styles.modalOverlay} onMouseDown={onClose}>
            <div
                className={wide ? `${styles.modalCard} ${styles.wide}` : styles.modalCard}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}