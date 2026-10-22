import { AlertCircle, ClipboardList, PackageCheck, UsersRound } from "lucide-react";
import { getDueState } from "../productionConfig";
import styles from "./ProductionSummary.module.css";

export default function ProductionSummary({ orders, isWorker }) {
  const cards = [
    { label: "Active orders", value: orders.length, icon: ClipboardList, tone: "blue" },
    ...(!isWorker ? [{
      label: "Unassigned",
      value: orders.filter((order) => !order.assignedWorkerId).length,
      icon: UsersRound,
      tone: "amber",
    }] : []),
    {
      label: "Past due",
      value: orders.filter((order) => getDueState(order.expectedDelivery) === "overdue").length,
      icon: AlertCircle,
      tone: "red",
    },
    {
      label: "Ready to dispatch",
      value: orders.filter((order) => order.currentStage === "READY_TO_DISPATCH").length,
      icon: PackageCheck,
      tone: "green",
    },
  ];

  return (
    <section className={styles.summaryGrid} aria-label="Production summary">
      {cards.map(({ label, value, icon: Icon, tone }) => (
        <div className={styles.summaryCard} key={label}>
          <span className={`${styles.summaryIcon} ${styles[`summary_${tone}`]}`}><Icon size={18} /></span>
          <span className={styles.summaryLabel}>{label}</span>
          <strong className={styles.summaryValue}>{value}</strong>
        </div>
      ))}
    </section>
  );
}
