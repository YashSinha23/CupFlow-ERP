package com.cupflow.CupFlow_ERP.inventory;

import com.cupflow.CupFlow_ERP.common.exception.InsufficientStockException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.material.Material;
import com.cupflow.CupFlow_ERP.material.MaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

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

    // Get Available Stock Summary
    public List<StockSummaryResponse> getStockSummary(){
        return stockLedgerRepository.getStockSummary().stream().map(StockSummaryResponse::new).toList();
    }

    // Called By Order Service
    @Transactional
    public void recordStockIn(StockLedgerRequest request, UUID performedBy) {
        Material material = materialRepository.getReferenceById(request.materialId());

        StockLedger entry = new StockLedger();
        entry.setMaterial(material);
        entry.setMovementType(MovementType.STOCK_IN);
        entry.setQuantity(request.quantity());
        entry.setOrderId(null);
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
        stockLedgerRepository.save(entry);
    }

    public List<LowStockWarning> checkThresholds(UUID orderId){
        List<StockLedger> touchedEntries = stockLedgerRepository.findByOrderId(orderId);

        List<LowStockWarning> warnings = new ArrayList<>();

        for(StockLedger entry : touchedEntries){
            Material material = entry.getMaterial();
            BigDecimal available = stockLedgerRepository.getAvailableStock(material.getId());

            if(available.compareTo(material.getMinThreshold()) < 0){
                warnings.add(new LowStockWarning(
                        material.getMaterialType(),
                        available,
                        material.getMinThreshold(),
                        material.getUnit()
                ));
            }
        }
        return warnings;
    }

    public ReservationResult evaluateAndReserve(UUID orderId, List<ReservationLine> lines, UUID performedBy) {

        List<ReservationLine> sortedLines = lines.stream()
                .sorted(Comparator.comparing(ReservationLine::materialId))
                .toList();

        Map<UUID, Material> lockedMaterials = new LinkedHashMap<>();
        for (ReservationLine line : sortedLines) {
            Material material = materialRepository.findByIdForUpdate(line.materialId())
                    .orElseThrow(() -> new ResourceNotFoundException("Material", line.materialId().toString()));
            lockedMaterials.put(line.materialId(), material);
        }

        List<StockShortfall> shortfalls = new ArrayList<>();
        for (ReservationLine line : sortedLines) {
            BigDecimal available = stockLedgerRepository.getAvailableStock(line.materialId());
            if (available.compareTo(line.requiredQty()) < 0) {
                Material material = lockedMaterials.get(line.materialId());
                shortfalls.add(new StockShortfall(
                        material.getMaterialType(),
                        line.requiredQty(),
                        available,
                        material.getUnit()
                ));
            }
        }

        if (!shortfalls.isEmpty()) {
            return new ReservationResult(ReservationOutcome.PENDING_STOCK, shortfalls);
        }

        for (ReservationLine line : sortedLines) {
            Material material = lockedMaterials.get(line.materialId());

            StockReservation reservation = new StockReservation();
            reservation.setOrderId(orderId);
            reservation.setMaterial(material);
            reservation.setReservedQty(line.requiredQty());
            reservation.setStatus(ReservationStatus.ACTIVE);
            stockReservationRepository.save(reservation);

            StockLedger entry = new StockLedger();
            entry.setMaterial(material);
            entry.setMovementType(MovementType.RESERVED);
            entry.setQuantity(line.requiredQty().negate());
            entry.setOrderId(orderId);
            entry.setPerformedBy(performedBy);
            stockLedgerRepository.save(entry);
        }

        return new ReservationResult(ReservationOutcome.CONFIRMED, List.of());
    }

    public List<StockShortfall> getShortfalls(List<ReservationLine> lines) {
        List<StockShortfall> shortfalls = new ArrayList<>();

        for (ReservationLine line : lines) {
            BigDecimal available =
                    stockLedgerRepository.getAvailableStock(line.materialId());

            Material material =
                    materialRepository.findById(line.materialId())
                            .orElseThrow(() ->
                                    new ResourceNotFoundException("Material", line.materialId().toString())
                            );

            if (available.compareTo(line.requiredQty()) < 0) {
                shortfalls.add(new StockShortfall(material.getMaterialType(), line.requiredQty(), available, material.getUnit()
                        )
                );
            }
        }
        return shortfalls;
    }

    // Called by DispatchService
    public void consumeReservations(UUID orderId, UUID performedBy){
        OffsetDateTime now = OffsetDateTime.now();

        List<StockReservation> activeReservations = stockReservationRepository.findByOrderIdAndStatus(orderId, ReservationStatus.ACTIVE);

        // Bulk Flip Reservation to CONSUMED
        stockReservationRepository.updateStatusByOrderId(orderId, ReservationStatus.CONSUMED, now);

        for(StockReservation reservation : activeReservations){
            StockLedger entry = new StockLedger();
            entry.setMaterial(reservation.getMaterial());
            entry.setMovementType(MovementType.CONSUMED);
            entry.setQuantity(reservation.getReservedQty().negate());
            entry.setOrderId(orderId);
            entry.setPerformedBy(performedBy);

            stockLedgerRepository.save(entry);
        }
    }
}