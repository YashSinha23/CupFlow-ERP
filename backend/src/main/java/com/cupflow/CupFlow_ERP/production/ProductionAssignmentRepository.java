package com.cupflow.CupFlow_ERP.production;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductionAssignmentRepository
        extends JpaRepository<ProductionAssignment, UUID> {

    Optional<ProductionAssignment> findFirstByOrder_IdAndEndedAtIsNull(
            UUID orderId
    );

    List<ProductionAssignment> findByOrder_IdOrderByAssignedAtDesc(
            UUID orderId
    );

    List<ProductionAssignment> findByWorker_IdAndEndedAtIsNull(
            UUID workerId
    );

    List<ProductionAssignment> findByOrder_IdInAndEndedAtIsNull(
            List<UUID> orderIds
    );
}