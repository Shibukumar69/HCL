package com.retail.inventory.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "inventory", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"product_id", "warehouse_id"})
})
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false)
    private Integer quantity = 0;

    @JsonProperty("min_threshold")
    @Column(name = "min_threshold", nullable = false)
    private Integer minThreshold = 10;

    public Inventory() {}

    public Inventory(Long id, Product product, Warehouse warehouse, Integer quantity, Integer minThreshold) {
        this.id = id;
        this.product = product;
        this.warehouse = warehouse;
        this.quantity = quantity != null ? quantity : 0;
        this.minThreshold = minThreshold != null ? minThreshold : 10;
    }

    public static InventoryBuilder builder() {
        return new InventoryBuilder();
    }

    public static class InventoryBuilder {
        private Long id;
        private Product product;
        private Warehouse warehouse;
        private Integer quantity = 0;
        private Integer minThreshold = 10;

        public InventoryBuilder id(Long id) { this.id = id; return this; }
        public InventoryBuilder product(Product product) { this.product = product; return this; }
        public InventoryBuilder warehouse(Warehouse warehouse) { this.warehouse = warehouse; return this; }
        public InventoryBuilder quantity(Integer quantity) { this.quantity = quantity; return this; }
        public InventoryBuilder minThreshold(Integer minThreshold) { this.minThreshold = minThreshold; return this; }
        public Inventory build() { return new Inventory(id, product, warehouse, quantity, minThreshold); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Warehouse getWarehouse() { return warehouse; }
    public void setWarehouse(Warehouse warehouse) { this.warehouse = warehouse; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Integer getMinThreshold() { return minThreshold; }
    public void setMinThreshold(Integer minThreshold) { this.minThreshold = minThreshold; }
}
