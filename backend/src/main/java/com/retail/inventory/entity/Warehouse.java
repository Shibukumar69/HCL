package com.retail.inventory.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "warehouses")
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(nullable = false)
    private Integer capacity = 1000;

    @CreationTimestamp
    @JsonProperty("created_at")
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Warehouse() {}

    public Warehouse(Long id, String code, String name, String location, Integer capacity, LocalDateTime createdAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.location = location;
        this.capacity = capacity != null ? capacity : 1000;
        this.createdAt = createdAt;
    }

    public static WarehouseBuilder builder() {
        return new WarehouseBuilder();
    }

    public static class WarehouseBuilder {
        private Long id;
        private String code;
        private String name;
        private String location;
        private Integer capacity = 1000;
        private LocalDateTime createdAt;

        public WarehouseBuilder id(Long id) { this.id = id; return this; }
        public WarehouseBuilder code(String code) { this.code = code; return this; }
        public WarehouseBuilder name(String name) { this.name = name; return this; }
        public WarehouseBuilder location(String location) { this.location = location; return this; }
        public WarehouseBuilder capacity(Integer capacity) { this.capacity = capacity; return this; }
        public WarehouseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Warehouse build() { return new Warehouse(id, code, name, location, capacity, createdAt); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
