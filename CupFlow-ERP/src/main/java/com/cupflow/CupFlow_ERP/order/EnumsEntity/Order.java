package com.cupflow.CupFlow_ERP.order.EnumsEntity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.generator.EventType;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;
import org.hibernate.annotations.Generated;


@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "order_code", unique = true, nullable = false, length = 30)
    private String orderCode;

    @Column(name = "customer_name", nullable = false, length = 255)
    private String customerName;

    @Column(name = "cup_type", nullable = false, length = 100)
    private String cupType;

    @Column(name = "cup_quantity", nullable = false)
    private Integer cupQuantity;

    @Column(name = "expected_delivery", nullable = false)
    private LocalDate expectedDelivery;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "current_stage", nullable = false)
    private OrderStage currentStage = OrderStage.ORDER_RECEIVED;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "stock_status",  nullable = false)
    private OrderStockStatus stockStatus = OrderStockStatus.PENDING_STOCK;

    @Column(name = "created_by", updatable = false, nullable = false)
    private UUID createdBy;

    @Generated(event = EventType.INSERT)
    @Column(name = "created_at",  updatable = false, insertable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private ZonedDateTime updatedAt;
}
