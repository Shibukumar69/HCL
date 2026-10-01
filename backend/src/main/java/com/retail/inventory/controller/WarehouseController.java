package com.retail.inventory.controller;

import com.retail.inventory.dto.*;
import com.retail.inventory.entity.Warehouse;
import com.retail.inventory.service.WarehouseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Warehouse>>> getAllWarehouses() {
        List<Warehouse> warehouses = warehouseService.getAllWarehouses();
        return ResponseEntity.ok(ApiResponse.successWithCount(warehouses.size(), warehouses));
    }

    @GetMapping("/inventory/overview")
    public ResponseEntity<ApiResponse<List<InventoryOverviewDto>>> getInventoryOverview() {
        List<InventoryOverviewDto> overview = warehouseService.getInventoryStock();
        return ResponseEntity.ok(ApiResponse.successWithCount(overview.size(), overview));
    }

    @GetMapping("/inventory/low-stock")
    public ResponseEntity<ApiResponse<List<LowStockAlertDto>>> getLowStockAlerts() {
        List<LowStockAlertDto> alerts = warehouseService.getLowStockAlerts();
        return ResponseEntity.ok(ApiResponse.successWithCount(alerts.size(), alerts));
    }

    @PostMapping("/inventory/transfer")
    public ResponseEntity<ApiResponse<Object>> transferStock(@Valid @RequestBody StockTransferRequest request) {
        String message = warehouseService.transferStock(request);
        return ResponseEntity.ok(ApiResponse.messageOnly(message));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Warehouse>> getWarehouseById(@PathVariable Long id) {
        Warehouse warehouse = warehouseService.getWarehouseById(id);
        return ResponseEntity.ok(ApiResponse.success(warehouse));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Warehouse>> createWarehouse(@Valid @RequestBody WarehouseRequest request) {
        Warehouse created = warehouseService.createWarehouse(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Warehouse registered successfully!", created));
    }
}
