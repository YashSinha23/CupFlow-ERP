package com.cupflow.CupFlow_ERP.inventory.EnumsEntity;

import com.cupflow.CupFlow_ERP.material.Entity.Material;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "stock_ledger")
@Getter
@Setter
public class StockLedger {


    @Id
    @UuidGenerator
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Enumerated
    @JdbcTypeCode((SqlTypes.NAMED_ENUM))
    @Column(name = "movement_type", nullable = false)
    private MovementType movementType;

    @Column(name = "quantity", nullable = false, precision = 10, scale = 3)
    private BigDecimal quantity;

    @Column(name = "order_id", nullable = false)
    private UUID orderId;

    @Column(name = "supplier_name", length = 255)
    private String supplierName;

    @Column(name = "performed_by", nullable = false)
    private UUID performedBy;

    @Column(name = "notes")
    private String notes;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

}
