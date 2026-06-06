package com.cupflow.CupFlow_ERP.order.Repository;

import com.cupflow.CupFlow_ERP.order.EnumsEntity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    boolean existsByOrderCode(String orderCode);
}
