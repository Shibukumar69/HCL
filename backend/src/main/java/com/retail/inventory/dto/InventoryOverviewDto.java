package com.retail.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class InventoryOverviewDto {

    @JsonProperty("inventory_id")
    private Long inventoryId;

    @JsonProperty("product_id")
    private Long productId;

    private String sku;

    @JsonProperty("product_name")
    private String productName;

    private String category;

    private BigDecimal price;

    @JsonProperty("warehouse_id")
    private Long warehouseId;

    @JsonProperty("warehouse_code")
    private String warehouseCode;

    @JsonProperty("warehouse_name")
    private String warehouseName;

    private String location;

    private Integer quantity;

    @JsonProperty("min_threshold")
    private Integer minThreshold;

    @JsonProperty("stock_status")
    private String stockStatus;

    public InventoryOverviewDto() {}

    public InventoryOverviewDto(Long inventoryId, Long productId, String sku, String productName, String category,
                                BigDecimal price, Long warehouseId, String warehouseCode, String warehouseName,
                                String location, Integer quantity, Integer minThreshold, String stockStatus) {
        this.inventoryId = inventoryId;
        this.productId = productId;
        this.sku = sku;
        this.productName = productName;
        this.category = category;
        this.price = price;
        this.warehouseId = warehouseId;
        this.warehouseCode = warehouseCode;
        this.warehouseName = warehouseName;
        this.location = location;
        this.quantity = quantity;
        this.minThreshold = minThreshold;
        this.stockStatus = stockStatus;
    }

    public Long getInventoryId() { return inventoryId; }
    public void setInventoryId(Long inventoryId) { this.inventoryId = inventoryId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public String getWarehouseCode() { return warehouseCode; }
    public void setWarehouseCode(String warehouseCode) { this.warehouseCode = warehouseCode; }
    public String getWarehouseName() { return warehouseName; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Integer getMinThreshold() { return minThreshold; }
    public void setMinThreshold(Integer minThreshold) { this.minThreshold = minThreshold; }
    public String getStockStatus() { return stockStatus; }
    public void setStockStatus(String stockStatus) { this.stockStatus = stockStatus; }
}
