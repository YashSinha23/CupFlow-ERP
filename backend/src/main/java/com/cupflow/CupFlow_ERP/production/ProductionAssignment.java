package com.cupflow.CupFlow_ERP.production;

import com.cupflow.CupFlow_ERP.order.Order;
import com.cupflow.CupFlow_ERP.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.generator.EventType;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "production_assignments")
@Getter
@Setter
public class ProductionAssignment {

    @Id
    @UuidGenerator
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private User worker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by", nullable = false)
    private User assignedBy;

    @Generated(event = EventType.INSERT)
    @Column(name = "assigned_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime assignedAt;

    @Column(name = "ended_at")
    private OffsetDateTime endedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ended_by")
    private User endedBy;
}