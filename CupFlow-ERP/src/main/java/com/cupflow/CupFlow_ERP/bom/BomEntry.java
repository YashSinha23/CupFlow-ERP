package com.cupflow.CupFlow_ERP.bom;


import com.cupflow.CupFlow_ERP.cup.Cup;
import com.cupflow.CupFlow_ERP.material.Material;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;


@Entity
@Table(
        name = "bom",
        uniqueConstraints =
        @UniqueConstraint(
                name = "unique_bom_entry",
                columnNames = {"cup_id", "material_id"}
        )
)
@Getter
@Setter
public class BomEntry {
    @Id
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cup_id", nullable = false)
    private Cup cup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(name = "qty_per_unit", nullable = false, precision = 10, scale = 5)
    private BigDecimal qtyPerUnit;
}
