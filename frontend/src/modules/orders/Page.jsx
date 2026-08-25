import { useMemo, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import Modal from "../../components/Modal";
import { getOrders, getOrderById } from "./api";
import OrderTable from "./components/OrderTable";
import CreateOrderForm from "./components/CreateOrderForm";
import AdvanceOrderForm from "./components/AdvanceOrderForm";
import OrderDetailModal from "./components/OrderDetailModal";
import styles from "./Page.module.css";

const STAGES = [
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

const STOCK_STATUSES = ["PENDING_STOCK", "CONFIRMED"];

export default function OrdersPage() {
  const {
    data: orders,
    loading,
    error,
    refetch,
  } = useFetch(() => getOrders(), []);

  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  function handleCreateSuccess() {
    setShowCreateForm(false);
    refetch();
  }

  function handleAdvanceSuccess() {
    setShowAdvanceForm(false);
    refetch();
  }

  async function handleOrderClick(order) {
    try {
        const detailedOrder = await getOrderById(order.id);
        setSelectedOrder(detailedOrder);
    } catch (error) {
        console.error(error);
    }
}

  const { activeOrders, dispatchedOrders } = useMemo(() => {
    if (!orders) {
      return {
        activeOrders: [],
        dispatchedOrders: [],
      };
    }

    const filtered = orders.filter((order) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        order.orderCode.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search);

      const matchesStage = !stageFilter || order.currentStage === stageFilter;

      const matchesStock = !stockFilter || order.stockStatus === stockFilter;

      return matchesSearch && matchesStage && matchesStock;
    });

    return {
      activeOrders: filtered.filter(
        (order) => order.currentStage !== "DISPATCHED",
      ),

      dispatchedOrders: filtered.filter(
        (order) => order.currentStage === "DISPATCHED",
      ),
    };
  }, [orders, searchTerm, stageFilter, stockFilter]);

  const advanceableOrders = useMemo(() => {
    return activeOrders.filter((order) => order.stockStatus === "CONFIRMED");
  }, [activeOrders]);

  if (loading) {
    return <p>Loading Orders</p>;
  }

  if (error) {
    return <p>Error loading Orders: {error.message}</p>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h1>Orders</h1>
        </div>

        <div className={styles.filtersBar}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>⌕</span>

            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className={styles.filterSelect}
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="">All Stages</option>

            {STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="">All Stock Status</option>

            {STOCK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>

          <div className={styles.actionButtons}>
            <button
              className={styles.advanceOrderButton}
              onClick={() => setShowAdvanceForm(true)}
              disabled={advanceableOrders.length === 0}
            >
              Advance Order
            </button>

            <button
              className={styles.createOrderButton}
              onClick={() => setShowCreateForm(true)}
            >
              + Create Order
            </button>
          </div>
        </div>

        {showCreateForm && (
          <Modal onClose={() => setShowCreateForm(false)}>
            <CreateOrderForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </Modal>
        )}

        {showAdvanceForm && (
          <Modal onClose={() => setShowAdvanceForm(false)}>
            <AdvanceOrderForm
              orders={advanceableOrders}
              onSuccess={handleAdvanceSuccess}
              onCancel={() => setShowAdvanceForm(false)}
            />
          </Modal>
        )}

        {activeOrders.length === 0 ? (
          <p className={styles.emptyState}>No active orders found.</p>
        ) : (
          <OrderTable orders={activeOrders} onRowClick={handleOrderClick} />
        )}

        {dispatchedOrders.length > 0 && (
          <div className={styles.dispatchedSection}>
            <h2 className={styles.sectionTitle}>Dispatched Orders</h2>

            <OrderTable
              orders={dispatchedOrders}
              onRowClick={handleOrderClick}
            />
          </div>
        )}

        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdated={refetch}
          />
        )}
      </div>
    </div>
  );
}
