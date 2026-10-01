package com.retail.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class ProductRequest {

    @NotBlank(message = "SKU is mandatory")
    private String sku;

    @NotBlank(message = "Name is mandatory")
    private String name;

    private String category;

    @NotNull(message = "Price is mandatory")
    private BigDecimal price;

    @JsonProperty("cost_price")
    private BigDecimal costPrice;

    public ProductRequest() {}

    public ProductRequest(String sku, String name, String category, BigDecimal price, BigDecimal costPrice) {
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.price = price;
        this.costPrice = costPrice;
    }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getCostPrice() { return costPrice; }
    public void setCostPrice(BigDecimal costPrice) { this.costPrice = costPrice; }
}
