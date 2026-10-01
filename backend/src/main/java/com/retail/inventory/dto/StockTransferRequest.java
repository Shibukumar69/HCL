package com.retail.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StockTransferRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Source warehouse ID is required")
    private Long sourceWarehouseId;

    @NotNull(message = "Destination warehouse ID is required")
    private Long destWarehouseId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Transfer quantity must be greater than 0")
    private Integer quantity;

    public StockTransferRequest() {}

    public StockTransferRequest(Long productId, Long sourceWarehouseId, Long destWarehouseId, Integer quantity) {
        this.productId = productId;
        this.sourceWarehouseId = sourceWarehouseId;
        this.destWarehouseId = destWarehouseId;
        this.quantity = quantity;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Long getSourceWarehouseId() { return sourceWarehouseId; }
    public void setSourceWarehouseId(Long sourceWarehouseId) { this.sourceWarehouseId = sourceWarehouseId; }
    public Long getDestWarehouseId() { return destWarehouseId; }
    public void setDestWarehouseId(Long destWarehouseId) { this.destWarehouseId = destWarehouseId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
