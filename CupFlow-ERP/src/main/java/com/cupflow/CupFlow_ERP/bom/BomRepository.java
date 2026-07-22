package com.cupflow.CupFlow_ERP.bom;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BomRepository extends JpaRepository<BomEntry, UUID> {

    @Query("SELECT b FROM BomEntry b JOIN FETCH b.material WHERE LOWER(b.cupType) = LOWER(:cupType)")
    List<BomEntry> findByCupTypeIgnoreCaseWithMaterial(@NotNull @Param("cupType") String cupType);

    boolean existsByCupTypeIgnoreCaseAndMaterial_Id(String cupType, UUID materialId);
}
