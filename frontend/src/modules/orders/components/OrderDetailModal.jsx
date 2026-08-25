import { useState } from "react";
import Modal from "../../../components/Modal";
import { dispatchOrder, retryReservation } from "../api";
import { notify } from "../../../lib/toast";
import OrderDetailsPanel from "./OrderDetailsPanel";
import OrderHistoryPanel from "./OrderHistoryPanel";
import styles from "./OrderDetailModal.module.css";

export default function OrderDetailModal({ order, onClose, onUpdated }) {
  const [activeTab, setActiveTab] = useState("details");

  const [dispatchDate, setDispatchDate] = useState("");
  const [transporterName, setTransporterName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [isDispatching, setIsDispatching] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [dispatchError, setDispatchError] = useState(null);

  async function handleRetryReservation() {
    if (isRetrying) return;

    setIsRetrying(true);

    try {
      const response = await retryReservation(order.id);

      if (response.stockStatus === "CONFIRMED") {
        notify.success("Stock reserved successfully");
      } else {
        notify.error("Stock still insufficient");
      }

      onUpdated();
      onClose();
    } catch (error) {
      notify.error(error.message);
    } finally {
      setIsRetrying(false);
    }
  }

  async function handleDispatch() {
    if (isDispatching) return;

    setDispatchError(null);
    setIsDispatching(true);

    try {
      await dispatchOrder(order.id, {
        dispatchDate,
        transporterName,
        vehicleNumber,
        notes: notes || null,
      });

      onUpdated();
      onClose();
    } catch (error) {
      setDispatchError(error.message);
    } finally {
      setIsDispatching(false);
    }
  }

  return (
    <Modal onClose={onClose} wide>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{order.orderCode}</h2>

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
            className={activeTab === "history" ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab("history")}
          >
            Stage History
          </button>
        </div>

        <div className={styles.viewport}>
          <div
            className={styles.track}
            style={{
              transform:
                activeTab === "details" ? "translateX(0%)" : "translateX(-50%)",
            }}
          >
            <div className={styles.panel}>
              <OrderDetailsPanel order={order} />
            </div>

            <div className={styles.panel}>
              <OrderHistoryPanel orderId={order.id} />
            </div>
          </div>
        </div>

        {order.stockStatus === "PENDING_STOCK" && (
          <div className={styles.footer}>
            <button
              className={styles.retryButton}
              onClick={handleRetryReservation}
              disabled={isRetrying}
            >
              {isRetrying ? "Checking Stock..." : "Retry Reservation"}
            </button>
          </div>
        )}

        {order.currentStage === "READY_TO_DISPATCH" && (
          <div className={styles.footer}>
            <div className={styles.dispatchFields}>
              <input
                type="date"
                value={dispatchDate}
                onChange={(e) => setDispatchDate(e.target.value)}
                disabled={isDispatching}
              />

              <input
                type="text"
                placeholder="Transporter name"
                value={transporterName}
                onChange={(e) => setTransporterName(e.target.value)}
                disabled={isDispatching}
              />

              <input
                type="text"
                placeholder="Vehicle number"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                disabled={isDispatching}
              />

              <input
                type="text"
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isDispatching}
              />
            </div>

            {dispatchError && <p className={styles.error}>{dispatchError}</p>}

            <button
              className={styles.dispatchButton}
              onClick={handleDispatch}
              disabled={
                isDispatching ||
                !dispatchDate ||
                !transporterName ||
                !vehicleNumber
              }
            >
              {isDispatching ? "Dispatching..." : "Dispatch Order"}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
