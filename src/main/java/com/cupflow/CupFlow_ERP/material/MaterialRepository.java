package com.cupflow.CupFlow_ERP.material;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MaterialRepository extends JpaRepository<Material, UUID> {
    boolean existsByMaterialTypeIgnoreCase(String materialType);

    Optional<Material> findByMaterialTypeIgnoreCase(String materialType);
}
