import styles from "./OrderStageProgress.module.css";

const ORDER_STAGES = [
  "ORDER_RECEIVED",
  "RAW_MATERIAL_ISSUED",
  "SHEET_MAKING_IN_PROGRESS",
  "SHEET_READY",
  "CUP_MOLDING_IN_PROGRESS",
  "CUPS_READY_FOR_PRINTING",
  "PRINTING_IN_PROGRESS",
  "READY_TO_DISPATCH",
  "DISPATCHED",
];

function formatStage(stage) {
  return stage
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function OrderStageProgress({ currentStage }) {
  const currentIndex = ORDER_STAGES.indexOf(currentStage);

  return (
    <section className={styles.section} aria-label="Production progress">
      <div className={styles.heading}>
        <h3>Production progress</h3>
        <span>{formatStage(currentStage)}</span>
      </div>

      <div className={styles.scrollArea}>
        <ol className={styles.steps}>
          {ORDER_STAGES.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            let stepClass = styles.upcoming;
            if (isCompleted) stepClass = styles.completed;
            if (isCurrent) stepClass = styles.current;

            return (
              <li
                key={stage}
                className={`${styles.step} ${stepClass}`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className={styles.marker} aria-hidden="true">
                  {isCompleted ? "✓" : index + 1}
                </span>
                <span className={styles.label}>{formatStage(stage)}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}