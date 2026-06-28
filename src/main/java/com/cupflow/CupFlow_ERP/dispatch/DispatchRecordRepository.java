package com.cupflow.CupFlow_ERP.dispatch;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DispatchRecordRepository extends JpaRepository<DispatchRecord, UUID> {
}
