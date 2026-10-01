package com.retail.inventory.service;

import com.retail.inventory.dto.DashboardStatsDto;
import com.retail.inventory.dto.OrderDto;
import com.retail.inventory.repository.InventoryRepository;
import com.retail.inventory.repository.OrderRepository;
import com.retail.inventory.repository.ProductRepository;
import com.retail.inventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public DashboardService(ProductRepository productRepository, WarehouseRepository warehouseRepository,
                            InventoryRepository inventoryRepository, OrderRepository orderRepository,
                            OrderService orderService) {
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryRepository = inventoryRepository;
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    public DashboardStatsDto getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalWarehouses = warehouseRepository.count();
        Long totalStockUnits = inventoryRepository.sumTotalQuantity();
        Long lowStockItemsCount = inventoryRepository.countLowStockItems();
        long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();

        List<OrderDto.OrderResponseDto> recentOrders = orderRepository.findTop5ByOrderByIdDesc().stream()
                .map(orderService::mapToOrderResponseDto)
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalProducts(totalProducts)
                .totalWarehouses(totalWarehouses)
                .totalStockUnits(totalStockUnits != null ? totalStockUnits : 0L)
                .lowStockItemsCount(lowStockItemsCount != null ? lowStockItemsCount : 0L)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .recentOrders(recentOrders)
                .build();
    }
}
