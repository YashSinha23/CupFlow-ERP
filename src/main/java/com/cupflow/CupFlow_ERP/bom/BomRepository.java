package com.cupflow.CupFlow_ERP.bom;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BomRepository extends JpaRepository<BomEntry, UUID> {
    List<BomEntry> findByCupTypeIgnoreCase(String cupType);

    boolean existsByCupTypeIgnoreCaseAndMaterial_Id(String cupType, UUID maerialId);
}
