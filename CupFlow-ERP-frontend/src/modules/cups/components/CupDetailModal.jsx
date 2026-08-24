import { useState } from "react";
import Modal from "../../../components/Modal";
import CupDetailsForm from "./CupDetailsForm";
import CupBomPanel from "./CupBomPanel";
import styles from "./CupDetailModal.module.css";

export default function CupDetailModal({ cup, onClose, onUpdated }) {
    const [activeTab, setActiveTab] = useState("details");

    return (
        <Modal onClose={onClose} wide>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{cup.cupName}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.tabBar}>
                    <button
                        className={activeTab === "details" ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab("details")}
                    >
                        Details
                    </button>
                    <button
                        className={activeTab === "bom" ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab("bom")}
                    >
                        BOM
                    </button>
                </div>

                <div className={styles.viewport}>
                    <div
                        className={styles.track}
                        style={{
                            transform: activeTab === "details" ? "translateX(0%)" : "translateX(-50%)"
                        }}
                    >
                        <div className={styles.panel}>
                            <CupDetailsForm cup={cup} onUpdated={onUpdated} />
                        </div>
                        <div className={styles.panel}>
                            <CupBomPanel cup={cup} />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}