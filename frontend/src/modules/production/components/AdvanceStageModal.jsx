import { useState } from "react";
import { ArrowRight, ChevronRight, X } from "lucide-react";
import Modal from "../../../components/Modal";
import { notify } from "../../../lib/toast";
import { formatStage, WORKFLOW_STAGES } from "../productionConfig";
import styles from "./AdvanceStageModal.module.css";

export default function AdvanceStageModal({ order, onClose, onSubmit }) {
  const [quantityReported, setQuantityReported] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const stageIndex = WORKFLOW_STAGES.indexOf(order.currentStage);
  const nextStage = WORKFLOW_STAGES[stageIndex + 1];

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting || !nextStage) return;

    setSubmitting(true);
    try {
      await onSubmit(order, {
        quantityReported: quantityReported === "" ? null : Number(quantityReported),
        notes: notes.trim() || null,
      });
    } catch (error) {
      notify.error(error.message || "Could not advance the production stage");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal onClose={() => !submitting && onClose()}>
      <form className={styles.modalContent} onSubmit={handleSubmit}>
        <div className={styles.modalHeader}>
          <span className={styles.modalIcon}><ArrowRight size={18} /></span>
          <div className={styles.modalHeading}>
            <h2>Advance production stage</h2>
            <p>{order.orderCode} · {formatStage(order.currentStage)}</p>
          </div>
          <button className={styles.closeButton} type="button" onClick={onClose} disabled={submitting} aria-label="Close dialog"><X size={18} /></button>
        </div>

        <div className={styles.nextStageNotice}>
          <span>Next stage</span>
          <strong>{formatStage(nextStage)}<ChevronRight size={15} /></strong>
        </div>

        <label className={styles.formField}>
          <span>Quantity reported <em>Optional</em></span>
          <input
            type="number"
            min="1"
            value={quantityReported}
            onChange={(event) => setQuantityReported(event.target.value)}
            placeholder={`Order quantity: ${order.cupQuantity}`}
            disabled={submitting}
          />
        </label>
        <label className={styles.formField}>
          <span>Production notes <em>Optional</em></span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Record a shift update or issue…"
            rows={3}
            disabled={submitting}
          />
        </label>
        <div className={styles.modalActions}>
          <button className={styles.secondaryButton} type="button" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className={styles.primaryButton} type="submit" disabled={submitting || !nextStage}>
            {submitting ? "Saving…" : "Confirm stage change"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
