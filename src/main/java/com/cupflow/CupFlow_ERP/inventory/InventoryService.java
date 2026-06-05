package com.cupflow.CupFlow_ERP.inventory;

import com.cupflow.CupFlow_ERP.common.exception.InsufficientStockException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.inventory.EnumsEntity.MovementType;
import com.cupflow.CupFlow_ERP.inventory.EnumsEntity.ReservationStatus;
import com.cupflow.CupFlow_ERP.inventory.EnumsEntity.StockLedger;
import com.cupflow.CupFlow_ERP.inventory.EnumsEntity.StockReservation;
import com.cupflow.CupFlow_ERP.inventory.Record.StockLedgerRequest;
import com.cupflow.CupFlow_ERP.inventory.Repository.StockLedgerRepository;
import com.cupflow.CupFlow_ERP.inventory.Repository.StockReservationRepository;
import com.cupflow.CupFlow_ERP.material.Material;
import com.cupflow.CupFlow_ERP.material.MaterialRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class InventoryService {

    private final StockLedgerRepository stockLedgerRepository;
    private final StockReservationRepository stockReservationRepository;
    private  final MaterialRepository materialRepository;

    public InventoryService(StockLedgerRepository stockLedgerRepository, StockReservationRepository stockReservationRepository, MaterialRepository materialRepository) {
        this.stockLedgerRepository = stockLedgerRepository;
        this.stockReservationRepository = stockReservationRepository;
        this.materialRepository = materialRepository;
    }

    // Called By Order Service
    public void recordStockIn(UUID orderId, StockLedgerRequest request, UUID performedBy) {
        Material material = materialRepository.getReferenceById(request.materialId());

        StockLedger entry = new StockLedger();
        entry.setMaterial(material);
        entry.setMovementType(MovementType.STOCK_IN);
        entry.setQuantity(request.quantity());
        entry.setOrderId(orderId);
        entry.setPerformedBy(performedBy);
        entry.setSupplierName(request.supplierName());
        entry.setNotes(request.notes());

        stockLedgerRepository.save(entry);
    }

    public void reserveStock(UUID orderId, UUID materialId, BigDecimal requiredQty, UUID performedBy) {
        BigDecimal available = stockLedgerRepository.getAvailableStock(materialId);

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Material", materialId.toString()));

        if(available.compareTo(requiredQty) < 0){
            throw new InsufficientStockException(material.getMaterialType(), requiredQty, available);
        }

        // Write reservation Record
        StockReservation reservation = new StockReservation();
        reservation.setOrderId(orderId);
        reservation.setMaterial(material);
        reservation.setReservedQty(requiredQty);
        reservation.setStatus(ReservationStatus.ACTIVE);
        stockReservationRepository.save(reservation);

        // Write ledger entry
        StockLedger entry = new StockLedger();
        entry.setMaterial(material);
        entry.setMovementType(MovementType.RESERVED);
        entry.setQuantity(requiredQty.negate());
        entry.setOrderId(orderId);
        entry.setPerformedBy(performedBy);
        stockLedgerRepository.save(entry);1
    }



}
