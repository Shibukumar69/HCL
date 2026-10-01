package com.retail.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderDto {

    public static class OrderItemRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        public OrderItemRequest() {}
        public OrderItemRequest(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }

    public static class CreateOrderRequest {
        @NotBlank(message = "Customer name is required")
        private String customerName;

        @NotBlank(message = "Customer email is required")
        @Email(message = "Invalid email format")
        private String customerEmail;

        @NotNull(message = "Warehouse ID is required")
        private Long warehouseId;

        @NotEmpty(message = "Order must contain at least 1 item")
        @Valid
        private List<OrderItemRequest> items;

        public CreateOrderRequest() {}
        public CreateOrderRequest(String customerName, String customerEmail, Long warehouseId, List<OrderItemRequest> items) {
            this.customerName = customerName;
            this.customerEmail = customerEmail;
            this.warehouseId = warehouseId;
            this.items = items;
        }

        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
        public Long getWarehouseId() { return warehouseId; }
        public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
        public List<OrderItemRequest> getItems() { return items; }
        public void setItems(List<OrderItemRequest> items) { this.items = items; }
    }

    public static class UpdateStatusRequest {
        @NotBlank(message = "Status is required")
        private String status;

        public UpdateStatusRequest() {}
        public UpdateStatusRequest(String status) { this.status = status; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class OrderItemResponseDto {
        private Long id;
        @JsonProperty("product_id")
        private Long productId;
        @JsonProperty("product_name")
        private String productName;
        private String sku;
        private Integer quantity;
        @JsonProperty("unit_price")
        private BigDecimal unitPrice;
        private BigDecimal subtotal;

        public OrderItemResponseDto() {}
        public OrderItemResponseDto(Long id, Long productId, String productName, String sku, Integer quantity, BigDecimal unitPrice, BigDecimal subtotal) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.sku = sku;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.subtotal = subtotal;
        }

        public static OrderItemResponseDtoBuilder builder() { return new OrderItemResponseDtoBuilder(); }
        public static class OrderItemResponseDtoBuilder {
            private Long id;
            private Long productId;
            private String productName;
            private String sku;
            private Integer quantity;
            private BigDecimal unitPrice;
            private BigDecimal subtotal;
            public OrderItemResponseDtoBuilder id(Long id) { this.id = id; return this; }
            public OrderItemResponseDtoBuilder productId(Long productId) { this.productId = productId; return this; }
            public OrderItemResponseDtoBuilder productName(String productName) { this.productName = productName; return this; }
            public OrderItemResponseDtoBuilder sku(String sku) { this.sku = sku; return this; }
            public OrderItemResponseDtoBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
            public OrderItemResponseDtoBuilder unitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; return this; }
            public OrderItemResponseDtoBuilder subtotal(BigDecimal subtotal) { this.subtotal = subtotal; return this; }
            public OrderItemResponseDto build() { return new OrderItemResponseDto(id, productId, productName, sku, quantity, unitPrice, subtotal); }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getSku() { return sku; }
        public void setSku(String sku) { this.sku = sku; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }

    public static class OrderResponseDto {
        private Long id;
        @JsonProperty("order_number")
        private String orderNumber;
        @JsonProperty("customer_name")
        private String customerName;
        @JsonProperty("customer_email")
        private String customerEmail;
        @JsonProperty("warehouse_id")
        private Long warehouseId;
        @JsonProperty("warehouse_name")
        private String warehouseName;
        @JsonProperty("total_amount")
        private BigDecimal totalAmount;
        private String status;
        @JsonProperty("created_at")
        private LocalDateTime createdAt;
        private List<OrderItemResponseDto> items = new ArrayList<>();

        public OrderResponseDto() {}
        public OrderResponseDto(Long id, String orderNumber, String customerName, String customerEmail, Long warehouseId,
                                String warehouseName, BigDecimal totalAmount, String status, LocalDateTime createdAt,
                                List<OrderItemResponseDto> items) {
            this.id = id;
            this.orderNumber = orderNumber;
            this.customerName = customerName;
            this.customerEmail = customerEmail;
            this.warehouseId = warehouseId;
            this.warehouseName = warehouseName;
            this.totalAmount = totalAmount;
            this.status = status;
            this.createdAt = createdAt;
            this.items = items != null ? items : new ArrayList<>();
        }

        public static OrderResponseDtoBuilder builder() { return new OrderResponseDtoBuilder(); }
        public static class OrderResponseDtoBuilder {
            private Long id;
            private String orderNumber;
            private String customerName;
            private String customerEmail;
            private Long warehouseId;
            private String warehouseName;
            private BigDecimal totalAmount;
            private String status;
            private LocalDateTime createdAt;
            private List<OrderItemResponseDto> items = new ArrayList<>();
            public OrderResponseDtoBuilder id(Long id) { this.id = id; return this; }
            public OrderResponseDtoBuilder orderNumber(String orderNumber) { this.orderNumber = orderNumber; return this; }
            public OrderResponseDtoBuilder customerName(String customerName) { this.customerName = customerName; return this; }
            public OrderResponseDtoBuilder customerEmail(String customerEmail) { this.customerEmail = customerEmail; return this; }
            public OrderResponseDtoBuilder warehouseId(Long warehouseId) { this.warehouseId = warehouseId; return this; }
            public OrderResponseDtoBuilder warehouseName(String warehouseName) { this.warehouseName = warehouseName; return this; }
            public OrderResponseDtoBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
            public OrderResponseDtoBuilder status(String status) { this.status = status; return this; }
            public OrderResponseDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
            public OrderResponseDtoBuilder items(List<OrderItemResponseDto> items) { this.items = items; return this; }
            public OrderResponseDto build() { return new OrderResponseDto(id, orderNumber, customerName, customerEmail, warehouseId, warehouseName, totalAmount, status, createdAt, items); }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getOrderNumber() { return orderNumber; }
        public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
        public String getCustomerName() { return customerName; }
        public void setCustomerName(String customerName) { this.customerName = customerName; }
        public String getCustomerEmail() { return customerEmail; }
        public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
        public Long getWarehouseId() { return warehouseId; }
        public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
        public String getWarehouseName() { return warehouseName; }
        public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public List<OrderItemResponseDto> getItems() { return items; }
        public void setItems(List<OrderItemResponseDto> items) { this.items = items; }
    }
}
