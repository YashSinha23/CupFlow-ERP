import { useState } from "react";
import { useAuth } from '../../../context/AuthContext'
import { activateUser, deactivateUser } from "../api";
import DetailPanel from "../../../components/DetailPanel";
import styles from "./UserDetailsCard.module.css";
import { notify } from "../../../lib/toast";

export default function UserDetailCard({ user, onClose, onStatusChange }) {
    const [pendingActive, setPendingActive] = useState(user.active);
    const [isSaving, setIsSaving] = useState(false);

    const { user: currentUser } = useAuth();
    const isSelf = user.id === currentUser.userId;

    const hasChanges = pendingActive !== user.active;

    async function handleSave() {
        if (!hasChanges || isSaving) return;

        setIsSaving(true);

        try {
            if (pendingActive) {
                await activateUser(user.id);
            } else {
                await deactivateUser(user.id);
            }
            notify.success(pendingActive ? "User activated." : "User deactivated");
            onStatusChange();
            onClose();
        } catch (err) {
            notify.error(err.message);
            setIsSaving(false);
        }
    }

    return (
        <DetailPanel onClose={onClose}>
            <div className={styles.header}>
                <h2 className={styles.title}>User Details</h2>
                <button className={styles.closeButton} onClick={onClose}>
                    ✕
                </button>
            </div>

            <div className={styles.infoSection}>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Full Name</span>
                    <span className={styles.infoValue}>{user.fullName}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email</span>
                    <span className={styles.infoValue}>{user.email}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Role</span>
                    <span className={styles.roleBadge}>{user.role}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Created At</span>
                    <span className={styles.infoValue}>{new Date(user.createdAt).toLocaleString()}</span>
                </div>
            </div>

            <div className={styles.editSection}>
                <label className={styles.checkboxRow}>
                    <input
                        type="checkbox"
                        checked={pendingActive}
                        disabled={isSelf || isSaving}
                        onChange={(e) => setPendingActive(e.target.checked)}
                    />
                    <span>Active</span>
                </label>

                {isSelf && <p className={styles.notice}>You cannot change your own status.</p>}
            </div>

            <div className={styles.footer}>
                <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving || isSelf}
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
            </div>
        </DetailPanel>
    );
}