package com.retail.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LowStockAlertDto {

    private String sku;

    @JsonProperty("product_name")
    private String productName;

    @JsonProperty("warehouse_code")
    private String warehouseCode;

    @JsonProperty("warehouse_name")
    private String warehouseName;

    private Integer quantity;

    @JsonProperty("min_threshold")
    private Integer minThreshold;

    public LowStockAlertDto() {}

    public LowStockAlertDto(String sku, String productName, String warehouseCode, String warehouseName, Integer quantity, Integer minThreshold) {
        this.sku = sku;
        this.productName = productName;
        this.warehouseCode = warehouseCode;
        this.warehouseName = warehouseName;
        this.quantity = quantity;
        this.minThreshold = minThreshold;
    }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getWarehouseCode() { return warehouseCode; }
    public void setWarehouseCode(String warehouseCode) { this.warehouseCode = warehouseCode; }
    public String getWarehouseName() { return warehouseName; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Integer getMinThreshold() { return minThreshold; }
    public void setMinThreshold(Integer minThreshold) { this.minThreshold = minThreshold; }
}
