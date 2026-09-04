import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import Modal from "../../components/Modal";
import { getStockSummary } from "./api";
import StockSummaryTable from "./components/StockSummaryTable";
import StockInForm from "./components/StockInForm";
import styles from "./Inventory.module.css";

export default function InventoryPage() {
  const {
    data: stockSummary,
    loading: stockSummaryLoading,
    error: stockSummaryError,
    refetch: refetchStockSummary,
  } = useFetch(getStockSummary);

  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);

  const handleOpenAddStock = () => setIsAddStockModalOpen(true);
  const handleCloseAddStock = () => setIsAddStockModalOpen(false);

  const handleStockInSuccess = () => {
    setIsAddStockModalOpen(false);
    refetchStockSummary();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Inventory</h1>
        <button
          type="button"
          className={styles.addStockButton}
          onClick={handleOpenAddStock}
          disabled={stockSummaryLoading}
        >
          + Add Stock
        </button>
      </div>

      {stockSummaryError && (
        <p className={styles.errorText}>
          Failed to load stock summary. Please try again.
        </p>
      )}


      <StockSummaryTable
        loading={stockSummaryLoading}
        materials={stockSummary ?? []}
      />

      {isAddStockModalOpen && (
        <Modal onClose={handleCloseAddStock}>
          <StockInForm
            materials={stockSummary ?? []}
            onSuccess={handleStockInSuccess}
            onCancel={handleCloseAddStock}
          />
        </Modal>
      )}
    </div>
  );
}
