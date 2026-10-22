import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Check,
  History,
  PackageCheck,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { formatDate, getDueState, WORKFLOW_STAGES } from "../productionConfig";
import styles from "./ProductionOrderCard.module.css";

export default function ProductionOrderCard({
  order,
  workers,
  canManageAssignments,
  workerListUnavailable,
  assigning,
  onAssign,
  onAdvance,
  onHistory,
}) {
  const [workerId, setWorkerId] = useState(order.assignedWorkerId || "");
  const dueState = getDueState(order.expectedDelivery);
  const stageIndex = WORKFLOW_STAGES.indexOf(order.currentStage);
  const canAdvance = order.stockStatus === "CONFIRMED"
    && stageIndex >= 0
    && stageIndex < WORKFLOW_STAGES.length - 1;

  useEffect(() => {
    setWorkerId(order.assignedWorkerId || "");
  }, [order.assignedWorkerId]);

  const hasAssignmentChange = workerId && workerId !== order.assignedWorkerId;
  const assignmentDisabled = assigning
    || workerListUnavailable
    || order.stockStatus !== "CONFIRMED"
    || order.currentStage === "READY_TO_DISPATCH";

  return (
    <article className={styles.orderCard}>
      <div className={styles.cardTopline}>
        <span className={styles.orderCode}>{order.orderCode}</span>
        <span className={`${styles.stockBadge} ${order.stockStatus === "CONFIRMED" ? styles.stockConfirmed : styles.stockPending}`}>
          {order.stockStatus === "CONFIRMED" ? "Materials ready" : "Stock pending"}
        </span>
      </div>

      <h3 className={styles.productName}>{order.cupName || "Unnamed product"}</h3>
      <div className={styles.quantityRow}>
        <span>Order quantity</span>
        <strong>{Number(order.cupQuantity || 0).toLocaleString()} cups</strong>
      </div>

      <div className={styles.progressBlock}>
        <div className={styles.progressText}>
          <span>Workflow progress</span>
          <strong>{stageIndex >= 0 ? `${stageIndex + 1} / ${WORKFLOW_STAGES.length}` : "—"}</strong>
        </div>
        <div className={styles.progressTrack}>
          <span style={{ width: `${stageIndex < 0 ? 0 : ((stageIndex + 1) / WORKFLOW_STAGES.length) * 100}%` }} />
        </div>
      </div>

      <div className={`${styles.dueRow} ${styles[`due_${dueState}`]}`}>
        <CalendarDays size={14} />
        <span>{dueState === "overdue" ? "Past due" : "Due"} {formatDate(order.expectedDelivery)}</span>
      </div>

      <div className={styles.assignmentBlock}>
        <div className={styles.assignmentLabel}><UserRound size={14} /><span>Assigned worker</span></div>
        {canManageAssignments ? (
          <div className={styles.assignControls}>
            <select
              aria-label={`Assign worker to ${order.orderCode}`}
              value={workerId}
              onChange={(event) => setWorkerId(event.target.value)}
              disabled={assignmentDisabled}
            >
              <option value="">Choose a worker</option>
              {order.assignedWorkerId && !workers.some((worker) => worker.id === order.assignedWorkerId) && (
                <option value={order.assignedWorkerId}>{order.assignedWorkerName || "Current worker"} (current)</option>
              )}
              {workers.map((worker) => (
                <option value={worker.id} key={worker.id}>{worker.fullName}</option>
              ))}
            </select>
            <button
              type="button"
              className={styles.assignButton}
              onClick={() => onAssign(order.id, workerId)}
              disabled={!hasAssignmentChange || assignmentDisabled}
              title={order.assignedWorkerId ? "Reassign worker" : "Assign worker"}
            >
              {assigning ? <RefreshCw size={14} className={styles.spinning} /> : <Check size={14} />}
            </button>
          </div>
        ) : (
          <strong className={styles.assignedWorkerName}>{order.assignedWorkerName || "Assignment unavailable"}</strong>
        )}
      </div>

      {order.stockStatus !== "CONFIRMED" && (
        <div className={styles.cardNotice}><AlertCircle size={14} />Confirm stock before production can begin.</div>
      )}

      <div className={styles.cardActions}>
        <button type="button" className={styles.historyButton} onClick={() => onHistory(order)}>
          <History size={14} /> History
        </button>
        {order.currentStage === "READY_TO_DISPATCH" ? (
          <span className={styles.completeLabel}><Check size={14} />Production complete</span>
        ) : (
          <button type="button" className={styles.advanceButton} onClick={() => onAdvance(order)} disabled={!canAdvance}>
            Advance <ArrowRight size={14} />
          </button>
        )}
      </div>
    </article>
  );
}
