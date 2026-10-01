package com.retail.inventory.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardStatsDto {

    private Long totalProducts;
    private Long totalWarehouses;
    private Long totalStockUnits;
    private Long lowStockItemsCount;
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private List<OrderDto.OrderResponseDto> recentOrders;

    public DashboardStatsDto() {}

    public DashboardStatsDto(Long totalProducts, Long totalWarehouses, Long totalStockUnits, Long lowStockItemsCount, Long totalOrders, BigDecimal totalRevenue, List<OrderDto.OrderResponseDto> recentOrders) {
        this.totalProducts = totalProducts;
        this.totalWarehouses = totalWarehouses;
        this.totalStockUnits = totalStockUnits;
        this.lowStockItemsCount = lowStockItemsCount;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.recentOrders = recentOrders;
    }

    public static DashboardStatsDtoBuilder builder() { return new DashboardStatsDtoBuilder(); }
    public static class DashboardStatsDtoBuilder {
        private Long totalProducts;
        private Long totalWarehouses;
        private Long totalStockUnits;
        private Long lowStockItemsCount;
        private Long totalOrders;
        private BigDecimal totalRevenue;
        private List<OrderDto.OrderResponseDto> recentOrders;

        public DashboardStatsDtoBuilder totalProducts(Long totalProducts) { this.totalProducts = totalProducts; return this; }
        public DashboardStatsDtoBuilder totalWarehouses(Long totalWarehouses) { this.totalWarehouses = totalWarehouses; return this; }
        public DashboardStatsDtoBuilder totalStockUnits(Long totalStockUnits) { this.totalStockUnits = totalStockUnits; return this; }
        public DashboardStatsDtoBuilder lowStockItemsCount(Long lowStockItemsCount) { this.lowStockItemsCount = lowStockItemsCount; return this; }
        public DashboardStatsDtoBuilder totalOrders(Long totalOrders) { this.totalOrders = totalOrders; return this; }
        public DashboardStatsDtoBuilder totalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; return this; }
        public DashboardStatsDtoBuilder recentOrders(List<OrderDto.OrderResponseDto> recentOrders) { this.recentOrders = recentOrders; return this; }
        public DashboardStatsDto build() { return new DashboardStatsDto(totalProducts, totalWarehouses, totalStockUnits, lowStockItemsCount, totalOrders, totalRevenue, recentOrders); }
    }

    public Long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }
    public Long getTotalWarehouses() { return totalWarehouses; }
    public void setTotalWarehouses(Long totalWarehouses) { this.totalWarehouses = totalWarehouses; }
    public Long getTotalStockUnits() { return totalStockUnits; }
    public void setTotalStockUnits(Long totalStockUnits) { this.totalStockUnits = totalStockUnits; }
    public Long getLowStockItemsCount() { return lowStockItemsCount; }
    public void setLowStockItemsCount(Long lowStockItemsCount) { this.lowStockItemsCount = lowStockItemsCount; }
    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    public List<OrderDto.OrderResponseDto> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderDto.OrderResponseDto> recentOrders) { this.recentOrders = recentOrders; }
}
