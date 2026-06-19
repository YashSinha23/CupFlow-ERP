package com.cupflow.CupFlow_ERP.order;

import com.cupflow.CupFlow_ERP.bom.BomEntry;
import com.cupflow.CupFlow_ERP.bom.BomRepository;
import com.cupflow.CupFlow_ERP.common.exception.AppException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.inventory.InventoryService;
import com.cupflow.CupFlow_ERP.inventory.Record.LowStockWarning;
import com.cupflow.CupFlow_ERP.order.DTOs.*;
import com.cupflow.CupFlow_ERP.order.EnumsEntity.Order;
import com.cupflow.CupFlow_ERP.order.EnumsEntity.OrderStage;
import com.cupflow.CupFlow_ERP.order.EnumsEntity.OrderStockStatus;
import com.cupflow.CupFlow_ERP.order.Repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final BomRepository bomRepository;
    private final InventoryService inventoryService;

    public OrderService(OrderRepository orderRepository, BomRepository bomRepository, InventoryService inventoryService) {
        this.orderRepository = orderRepository;
        this.bomRepository = bomRepository;
        this.inventoryService = inventoryService;
    }

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern(("yyyyMMdd"));
    private static final Random RANDOM = new Random();


    // Create Order - 6-Step Atomic Transaction
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, UUID performedBy) {

        // Step 1 : INSERT Order
        String orderCode =generateOrderCode();

        Order order = new Order();
        order.setOrderCode(orderCode);
        order.setCustomerName(request.getCustomerName());
        order.setCupType(request.getCupType());
        order.setCupQuantity(request.getCupQuantity());
        order.setExpectedDelivery(request.getExpectedDelivery());
        order.setCreatedBy(performedBy);
        order =  orderRepository.save(order);


        // Step 2 : Fetch BOM
        List<BomEntry> bomEntries = bomRepository.findByCupTypeIgnoreCase(request.getCupType());

        if(bomEntries.isEmpty()){
            throw new ResourceNotFoundException("No Bom found for cup type " + request.getCupType());
        }

        // Step 3+4 : Calculate Requirements + Reserve Stock
        for(BomEntry entry : bomEntries){
            BigDecimal requiredQty = entry.getQtyPerUnit().multiply(BigDecimal.valueOf(request.getCupQuantity()));

            inventoryService.reserveStock(
                    order.getId(),
                    entry.getMaterial().getId(),
                    requiredQty,
                    performedBy
            );
        }

        // Step 5 : Update Order Status/Stage
        order.setCurrentStage(OrderStage.RAW_MATERIAL_ISSUED);
        order.setStockStatus(OrderStockStatus.CONFIRMED);
        order = orderRepository.save(order);

        // Step 6 : Check Thresholds
        List<LowStockWarning> warnings = inventoryService.checkThresholds(order.getId());

        return OrderResponse.from(order, warnings);
    }

    public String generateOrderCode() {
        String today = LocalDate.now().format(DATE_FORMATTER);

        for(int attempt = 0; attempt < 3; attempt++) {
            String suffix = String.format("%04d", RANDOM.nextInt(10000));
            String candidate = "ORD-" + today + "-" + suffix;

            if(!orderRepository.existsByOrderCode(candidate)) {
                return candidate;
            }
        }
        throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to generate unique order code. Please retry");
    }
}
