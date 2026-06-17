package com.cupflow.CupFlow_ERP.production;


import com.cupflow.CupFlow_ERP.order.EnumsEntity.OrderStage;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "production_stage_logs")
@Getter
@Setter
public class ProductionStageLog {

    @Id
    @UuidGenerator
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "order_id", nullable = false)
    private UUID orderId;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "from_stage", nullable = false)
    private OrderStage fromStage;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "to_stage", nullable = false)
    private OrderStage toStage;

    @Column(name = "quantity_reported")
    private Integer quantityReported;

    @Column(name = "notes", columnDefinition = "text")
    private String notes;

    @Column(name = "performed_by", nullable = false)
    private UUID performedBy;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
