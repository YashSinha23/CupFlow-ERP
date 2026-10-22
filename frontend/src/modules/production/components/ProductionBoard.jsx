import { useMemo, useState } from "react";
import { Activity, AlertCircle, Factory, Search, X } from "lucide-react";
import ProductionOrderCard from "./ProductionOrderCard";
import { orderMatches, PRODUCTION_LANES } from "../productionConfig";
import styles from "./ProductionBoard.module.css";

export default function ProductionBoard({
  orders,
  workers,
  loading,
  isWorker,
  canManageAssignments,
  workerLoadError,
  assigningOrderId,
  onAssign,
  onAdvance,
  onHistory,
}) {
  const [search, setSearch] = useState("");
  const filteredOrders = useMemo(
    () => orders.filter((order) => orderMatches(order, search.trim().toLowerCase())),
    [orders, search],
  );

  return (
    <section className={styles.boardSection}>
      <div className={styles.boardToolbar}>
        <div className={styles.boardTitle}>
          <Activity size={18} />
          <div>
            <h2>Production board</h2>
            <span>{filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}</span>
          </div>
        </div>
        <label className={styles.searchBox}>
          <Search size={16} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order, product, or worker"
            aria-label="Search production orders"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>
          )}
        </label>
      </div>

      {workerLoadError && canManageAssignments && (
        <div className={styles.inlineNotice}>
          Worker list could not be loaded. Refresh the page before assigning work.
        </div>
      )}

      {loading ? (
        <div className={styles.loadingState}><div className={styles.spinner} /><span>Loading production board…</span></div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><Factory size={24} /></div>
          <strong>{isWorker ? "No work is assigned to you" : "No production orders yet"}</strong>
          <span>{isWorker
            ? "When a supervisor assigns you an order, it will appear here."
            : "Confirmed orders will appear here as they enter production."}</span>
        </div>
      ) : (
        <div className={styles.boardScroller}>
          <div className={styles.board}>
            {PRODUCTION_LANES.map((lane) => {
              const laneOrders = filteredOrders.filter((order) => lane.stages.includes(order.currentStage));
              return (
                <section className={styles.lane} key={lane.title}>
                  <div className={`${styles.laneHeader} ${styles[`lane_${lane.tone}`]}`}>
                    <div className={styles.laneHeading}>
                      <span className={styles.laneTitle}>{lane.title}</span>
                      <span className={styles.laneCount}>{laneOrders.length}</span>
                    </div>
                    <span className={styles.laneHint}>{lane.hint}</span>
                  </div>
                  <div className={styles.laneCards}>
                    {laneOrders.length === 0 ? (
                      <div className={styles.laneEmpty}>No orders in this stage</div>
                    ) : laneOrders.map((order) => (
                      <ProductionOrderCard
                        key={order.id}
                        order={order}
                        workers={workers}
                        canManageAssignments={canManageAssignments}
                        workerListUnavailable={workerLoadError}
                        assigning={assigningOrderId === order.id}
                        onAssign={onAssign}
                        onAdvance={onAdvance}
                        onHistory={onHistory}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {!loading && orders.length > 0 && search && filteredOrders.length === 0 && (
        <div className={styles.searchEmpty}>No orders match “{search}”.</div>
      )}
    </section>
  );
}
