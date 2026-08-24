package com.cupflow.CupFlow_ERP.cup;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CupRepository extends JpaRepository<Cup, UUID> {
    boolean existsByCupNameIgnoreCase(String cupName);
    boolean existsByCupNameIgnoreCaseAndIdNot(String cupName, UUID id);
}
