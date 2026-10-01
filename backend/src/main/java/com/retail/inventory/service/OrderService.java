package com.retail.inventory.service;

import com.retail.inventory.dto.OrderDto;
import com.retail.inventory.entity.*;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.exception.ResourceNotFoundException;
import com.retail.inventory.repository.InventoryRepository;
import com.retail.inventory.repository.OrderRepository;
import com.retail.inventory.repository.ProductRepository;
import com.retail.inventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;

    private static final List<String> VALID_STATUSES = Arrays.asList(
            "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"
    );

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
                        WarehouseRepository warehouseRepository, InventoryRepository inventoryRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public List<OrderDto.OrderResponseDto> getAllOrders() {
        return orderRepository.findAllByOrderByIdDesc().stream()
                .map(this::mapToOrderResponseDto)
                .collect(Collectors.toList());
    }

    public OrderDto.OrderResponseDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order #" + id + " not found"));
        return mapToOrderResponseDto(order);
    }

    @Transactional
    public OrderDto.OrderResponseDto placeOrder(OrderDto.CreateOrderRequest request) {
        Warehouse warehouse = warehouseRepository.findById(request.getWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse with ID " + request.getWarehouseId() + " not found"));

        String orderNumber = "ORD-" + (System.currentTimeMillis() % 100000000L);

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .warehouse(warehouse)
                .status("PENDING")
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderDto.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product ID " + itemReq.getProductId() + " not found"));

            Inventory inventory = inventoryRepository.findByProductIdAndWarehouseIdWithLock(product.getId(), warehouse.getId())
                    .orElseThrow(() -> new BadRequestException("Insufficient stock for " + product.getName() + " in this warehouse! (Available: 0)"));

            if (inventory.getQuantity() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for " + product.getName() + 
                        " in this warehouse! (Available: " + inventory.getQuantity() + ")");
            }

            // Deduct stock
            inventory.setQuantity(inventory.getQuantity() - itemReq.getQuantity());
            inventoryRepository.save(inventory);

            BigDecimal unitPrice = product.getPrice();
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(unitPrice)
                    .subtotal(subtotal)
                    .build();

            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        return mapToOrderResponseDto(savedOrder);
    }

    @Transactional
    public OrderDto.OrderResponseDto updateOrderStatus(Long id, String status) {
        if (status == null || !VALID_STATUSES.contains(status.toUpperCase())) {
            throw new BadRequestException("Invalid status! Allowed: " + String.join(", ", VALID_STATUSES));
        }

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order #" + id + " not found"));

        order.setStatus(status.toUpperCase());
        Order updated = orderRepository.save(order);

        return mapToOrderResponseDto(updated);
    }

    public OrderDto.OrderResponseDto mapToOrderResponseDto(Order order) {
        List<OrderDto.OrderItemResponseDto> itemDtos = new ArrayList<>();
        if (order.getItems() != null) {
            itemDtos = order.getItems().stream().map(item -> OrderDto.OrderItemResponseDto.builder()
                    .id(item.getId())
                    .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                    .productName(item.getProduct() != null ? item.getProduct().getName() : null)
                    .sku(item.getProduct() != null ? item.getProduct().getSku() : null)
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .subtotal(item.getSubtotal())
                    .build()
            ).collect(Collectors.toList());
        }

        return OrderDto.OrderResponseDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomerName())
                .customerEmail(order.getCustomerEmail())
                .warehouseId(order.getWarehouse() != null ? order.getWarehouse().getId() : null)
                .warehouseName(order.getWarehouse() != null ? order.getWarehouse().getName() : null)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(itemDtos)
                .build();
    }
}
