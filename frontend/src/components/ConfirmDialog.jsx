import styles from "./ConfirmDialog.module.css";
import Modal from "./Modal";

export default function ConfirmDialog({
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isDestructive = false,
    onConfirm,
    onCancel,
}) {
    return (
        <Modal onClose={onCancel}>
            <div className={styles.dialog}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className={isDestructive ? styles.destructiveButton : styles.confirmButton}
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}