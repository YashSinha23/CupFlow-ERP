import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock3, History, PackageCheck, UserRound, X } from "lucide-react";
import Modal from "../../../components/Modal";
import { notify } from "../../../lib/toast";
import { getProductionHistory } from "../api";
import { formatStage } from "../productionConfig";
import styles from "./ProductionHistoryModal.module.css";

export default function ProductionHistoryModal({ order, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    async function loadHistory() {
      setLoading(true);
      try {
        const result = await getProductionHistory(order.id);
        if (isCurrent) setHistory(Array.isArray(result) ? result : []);
      } catch (error) {
        if (isCurrent) notify.error(error.message || "Could not load order history");
      } finally {
        if (isCurrent) setLoading(false);
      }
    }
    loadHistory();
    return () => { isCurrent = false; };
  }, [order.id]);

  return (
    <Modal onClose={onClose} wide>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <span className={styles.modalIcon}><History size={18} /></span>
          <div className={styles.modalHeading}>
            <h2>Production history</h2>
            <p>{order.orderCode} · {order.cupName}</p>
          </div>
          <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button>
        </div>

        {loading ? (
          <div className={styles.historyLoading}><div className={styles.spinner} />Loading order history…</div>
        ) : history.length === 0 ? (
          <div className={styles.historyEmpty}>No stage changes have been recorded for this order.</div>
        ) : (
          <ol className={styles.historyList}>
            {history.map((entry) => (
              <li className={styles.historyEntry} key={entry.id}>
                <span className={styles.historyDot}><Check size={12} /></span>
                <div className={styles.historyBody}>
                  <div className={styles.historyTransition}>
                    <span>{formatStage(entry.fromStage)}</span>
                    <ArrowRight size={14} />
                    <strong>{formatStage(entry.toStage)}</strong>
                  </div>
                  <div className={styles.historyMeta}>
                    <span><UserRound size={13} />{entry.performedByName || "Unknown user"}</span>
                    {entry.createdAt && <span><Clock3 size={13} />{new Date(entry.createdAt).toLocaleString()}</span>}
                    {entry.quantityReported != null && <span><PackageCheck size={13} />{entry.quantityReported.toLocaleString()} reported</span>}
                  </div>
                  {entry.notes && <p className={styles.historyNotes}>{entry.notes}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Modal>
  );
}
