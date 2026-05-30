package com.cupflow.CupFlow_ERP.bom;


import com.cupflow.CupFlow_ERP.material.Material;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "bom",
        uniqueConstraints =
        @UniqueConstraint(name = "unique_bom_entry", columnNames = {"cup_type","material_id"}
        )
)
@Getter
@Setter
public class BomEntry {
    @Id
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(name = "cup_type", nullable = false, length = 100)
    private String cup_type;;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(name = "qty_per_unit", nullable = false, precision = 10, scale = 5)
    private BigDecimal qtyPerUnit;
}
