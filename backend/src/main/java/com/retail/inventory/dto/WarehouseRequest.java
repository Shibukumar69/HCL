package com.retail.inventory.dto;

import jakarta.validation.constraints.NotBlank;

public class WarehouseRequest {

    @NotBlank(message = "Warehouse code is required")
    private String code;

    @NotBlank(message = "Warehouse name is required")
    private String name;

    @NotBlank(message = "Warehouse location is required")
    private String location;

    private Integer capacity = 1000;

    public WarehouseRequest() {}

    public WarehouseRequest(String code, String name, String location, Integer capacity) {
        this.code = code;
        this.name = name;
        this.location = location;
        this.capacity = capacity != null ? capacity : 1000;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
}
