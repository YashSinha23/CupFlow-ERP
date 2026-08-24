package com.cupflow.CupFlow_ERP.bom;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BomRepository extends JpaRepository<BomEntry, UUID> {

    @Query("""
        SELECT b
        FROM BomEntry b
        JOIN FETCH b.material
        WHERE b.cup.id = :cupId
    """)
    List<BomEntry> findByCupIdWithMaterial(@Param("cupId") UUID cupId);

    List<BomEntry> findByCupId(UUID cupId);

    boolean existsByCup_IdAndMaterial_Id(UUID cupId, UUID materialId);
}