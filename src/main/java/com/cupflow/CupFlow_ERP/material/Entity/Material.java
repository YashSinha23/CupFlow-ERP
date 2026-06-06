package com.cupflow.CupFlow_ERP.material.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "materials")
@Getter
@Setter
@NoArgsConstructor
public class Material {

    @Id
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(name = "material_type", nullable = false, unique = true, length = 255)
    private String materialType;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "min_threshold", nullable = false, precision = 10, scale = 3)
    private BigDecimal minThreshold = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false)
    private OffsetDateTime createdAt;
}
