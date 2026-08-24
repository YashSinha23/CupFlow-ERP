package com.cupflow.CupFlow_ERP.order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    boolean existsByOrderCode(String orderCode);

    List<Order> findByStockStatus(OrderStockStatus stockStatus);
}