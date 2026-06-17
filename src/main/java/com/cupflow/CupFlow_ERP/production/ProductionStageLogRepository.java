package com.cupflow.CupFlow_ERP.production;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductionStageLogRepository extends JpaRepository<ProductionStageLog , UUID> {
}
