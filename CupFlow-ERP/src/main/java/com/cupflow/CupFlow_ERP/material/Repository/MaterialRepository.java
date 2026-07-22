package com.cupflow.CupFlow_ERP.material.Repository;

import com.cupflow.CupFlow_ERP.material.Entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MaterialRepository extends JpaRepository<Material, UUID> {
    boolean existsByMaterialTypeIgnoreCase(String materialType);

    Optional<Material> findByMaterialTypeIgnoreCase(String materialType);
}
