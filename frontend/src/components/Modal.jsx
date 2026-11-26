import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export default function Modal({ onClose, children, wide = false }) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return createPortal(
        <div className={styles.modalOverlay} onMouseDown={onClose}>
            <div
                className={wide ? `${styles.modalCard} ${styles.wide}` : styles.modalCard}
                role="dialog"
                aria-modal="true"
                onMouseDown={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}
