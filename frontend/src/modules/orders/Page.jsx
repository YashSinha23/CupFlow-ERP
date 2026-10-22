import { useMemo, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import Modal from "../../components/Modal";
import { notify } from "../../lib/toast";
import { getOrders, getOrderById } from "./api";
import OrderTable from "./components/OrderTable";
import CreateOrderForm from "./components/CreateOrderForm";
import AdvanceOrderForm from "./components/AdvanceOrderForm";
import OrderDetailModal from "./components/OrderDetailModal";
import styles from "./Page.module.css";
import { Skeleton } from "@chakra-ui/react";
import { ClipboardList, AlertTriangle, Factory, Truck } from "lucide-react";

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
  const [openingOrderId, setOpeningOrderId] = useState(null);

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
    setOpeningOrderId(order.id);

    try {
      const detailedOrder = await getOrderById(order.id);
      setSelectedOrder(detailedOrder);
    } catch (error) {
      notify.error(`Could not open order: ${error.message}`);
    } finally {
      setOpeningOrderId(null);
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

  const hasFilters =
    searchTerm.trim() != "" || stageFilter !== "" || stockFilter !== "";

  const filteredOrderCount = activeOrders.length + dispatchedOrders.length;

  function clearFilters() {
    setSearchTerm("");
    setStageFilter("");
    setStockFilter("");
  }

  const advanceableOrders = useMemo(() => {
    return activeOrders.filter((order) => order.stockStatus === "CONFIRMED");
  }, [activeOrders]);

  const summaryStats = [
    {
      label: "Active orders",
      value: activeOrders.length,
      note: "Orders not yet dispatched",
      icon: ClipboardList,
    },
    {
      label: "Pending stock",
      value: activeOrders.filter(
        (order) => order.stockStatus === "PENDING_STOCK",
      ).length,
      note: "Waiting for material availability",
      icon: AlertTriangle,
    },
    {
      label: "On the production line",
      value: activeOrders.filter(
        (order) =>
          order.currentStage !== "ORDER_RECEIVED" &&
          order.currentStage !== "READY_TO_DISPATCH",
      ).length,
      note: "Orders that have started production",
      icon: Factory,
    },
    {
      label: "Ready to dispatch",
      value: activeOrders.filter(
        (order) => order.currentStage === "READY_TO_DISPATCH",
      ).length,
      note: "Production is complete",
      icon: Truck,
    },
  ];

  if (error) {
    return <p>Error loading Orders: {error.message}</p>;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Manufacturing</p>
            <h1>Orders</h1>
            <p className={styles.pageDescription}>
              Track customer orders from material reservation through dispatch.
            </p>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.advanceOrderButton}
              onClick={() => setShowAdvanceForm(true)}
              disabled={advanceableOrders.length === 0}
            >
              Advance order
            </button>

            <button
              type="button"
              className={styles.createOrderButton}
              onClick={() => setShowCreateForm(true)}
            >
              + Create order
            </button>
          </div>
        </div>

        <section className={styles.summaryGrid} aria-label="Order summary">
          {summaryStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article className={styles.summaryCard} key={stat.label}>
                <div className={styles.summaryCardTop}>
                  <span className={styles.summaryLabel}>{stat.label}</span>
                  <span className={styles.summaryIcon}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                </div>

                <strong className={styles.summaryValue}>
                  {loading ? "—" : stat.value}
                </strong>

                <span className={styles.summaryNote}>{stat.note}</span>
              </article>
            );
          })}
        </section>

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
        </div>

        {!loading && orders && (
          <div className={styles.resultsBar}>
            <span>
              {hasFilters
                ? `${filteredOrderCount} matching ${
                    filteredOrderCount === 1 ? "order" : "orders"
                  }`
                : `${orders.length} total ${
                    orders.length === 1 ? "order" : "orders"
                  }`}
            </span>

            {hasFilters && (
              <button
                type="button"
                className={styles.clearFiltersButton}
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

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

        {loading ? (
          <div className={styles.orderSkeleton}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.skeletonRow}>
                <Skeleton height="18px" width="120px" />
                <Skeleton height="18px" width="160px" />
                <Skeleton height="18px" width="180px" />
                <Skeleton height="18px" width="120px" />
                <Skeleton height="18px" width="100px" />
              </div>
            ))}
          </div>
        ) : filteredOrderCount === 0 ? (
          <p className={styles.emptyState}>
            {hasFilters
              ? "No orders match these filters. Try changing or clearing your filters."
              : "No orders yet. Create an order to start tracking production."}
          </p>
        ) : activeOrders.length > 0 ? (
          <OrderTable
            orders={activeOrders}
            onRowClick={handleOrderClick}
            openingOrderId={openingOrderId}
          />
        ) : null}

        {dispatchedOrders.length > 0 && (
          <div className={styles.dispatchedSection}>
            <h2 className={styles.sectionTitle}>Dispatched Orders</h2>

            <OrderTable
              orders={dispatchedOrders}
              onRowClick={handleOrderClick}
              openingOrderId={openingOrderId}
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
