package com.cupflow.CupFlow_ERP.material;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface MaterialRepository extends JpaRepository<Material, UUID> {
    boolean existsByMaterialTypeIgnoreCase(String materialType);

    Optional<Material> findByMaterialTypeIgnoreCase(String materialType);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT m FROM Material m WHERE m.id = :id")
    Optional<Material> findByIdForUpdate(@Param("id") UUID id);
}
