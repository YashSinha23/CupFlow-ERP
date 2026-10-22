import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Factory, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { notify } from "../../lib/toast";
import {
  advanceProductionOrder,
  assignProductionWorker,
  getEligibleWorkers,
  getProductionOrders,
} from "./api";
import ProductionBoard from "./components/ProductionBoard";
import ProductionSummary from "./components/ProductionSummary";
import AdvanceStageModal from "./components/AdvanceStageModal";
import ProductionHistoryModal from "./components/ProductionHistoryModal";
import styles from "./Page.module.css";

export default function ProductionPage() {
  const { user } = useAuth();
  const isWorker = user?.role === "WORKER";
  const canManageAssignments = ["ADMIN", "MANAGER", "FLOOR_SUPERVISOR"].includes(
    user?.role,
  );

  const [orders, setOrders] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [workerLoadError, setWorkerLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [assigningOrderId, setAssigningOrderId] = useState(null);
  const [advanceOrder, setAdvanceOrder] = useState(null);
  const [historyOrder, setHistoryOrder] = useState(null);

  const loadData = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
    setLoadError("");

    const [ordersResult, workersResult] = await Promise.allSettled([
      getProductionOrders(),
      canManageAssignments ? getEligibleWorkers() : Promise.resolve([]),
    ]);

    if (ordersResult.status === "fulfilled") {
      setOrders(Array.isArray(ordersResult.value) ? ordersResult.value : []);
    } else {
      setLoadError(ordersResult.reason?.message || "Could not load production orders.");
    }

    if (workersResult.status === "fulfilled") {
      setWorkers(Array.isArray(workersResult.value) ? workersResult.value : []);
      setWorkerLoadError(false);
    } else {
      setWorkers([]);
      setWorkerLoadError(true);
    }

    setLoading(false);
    setRefreshing(false);
  }, [canManageAssignments]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAssign(orderId, workerId) {
    setAssigningOrderId(orderId);
    try {
      await assignProductionWorker(orderId, workerId);
      notify.success("Production worker assigned");
      await loadData(true);
    } catch (error) {
      notify.error(error.message || "Could not assign the worker");
    } finally {
      setAssigningOrderId(null);
    }
  }

  async function handleAdvance(order, payload) {
    await advanceProductionOrder(order.id, payload);
    notify.success("Production stage advanced");
    setAdvanceOrder(null);
    await loadData(true);
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <div className={styles.eyebrow}><Factory size={15} /> Manufacturing</div>
          <h1>Production</h1>
          <p>{isWorker
            ? "Your currently assigned production work."
            : "Track orders through each step of the production floor."}</p>
        </div>
        <button
          className={styles.refreshButton}
          type="button"
          onClick={() => loadData(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw size={16} className={refreshing ? styles.spinning : ""} />
          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </header>

      {loadError ? (
        <section className={styles.pageError}>
          <AlertCircle size={22} />
          <div><strong>Production board unavailable</strong><span>{loadError}</span></div>
          <button type="button" onClick={() => loadData()}>Try again</button>
        </section>
      ) : (
        <>
          {!loading && <ProductionSummary orders={orders} isWorker={isWorker} />}
          <ProductionBoard
            orders={orders}
            workers={workers}
            loading={loading}
            refreshing={refreshing}
            isWorker={isWorker}
            canManageAssignments={canManageAssignments}
            workerLoadError={workerLoadError}
            assigningOrderId={assigningOrderId}
            onAssign={handleAssign}
            onAdvance={setAdvanceOrder}
            onHistory={setHistoryOrder}
          />
        </>
      )}

      {advanceOrder && (
        <AdvanceStageModal
          order={advanceOrder}
          onClose={() => setAdvanceOrder(null)}
          onSubmit={handleAdvance}
        />
      )}
      {historyOrder && (
        <ProductionHistoryModal
          order={historyOrder}
          onClose={() => setHistoryOrder(null)}
        />
      )}
    </div>
  );
}
