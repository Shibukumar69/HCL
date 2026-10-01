package com.retail.inventory.service;

import com.retail.inventory.dto.InventoryOverviewDto;
import com.retail.inventory.dto.LowStockAlertDto;
import com.retail.inventory.dto.StockTransferRequest;
import com.retail.inventory.dto.WarehouseRequest;
import com.retail.inventory.entity.Inventory;
import com.retail.inventory.entity.Product;
import com.retail.inventory.entity.Warehouse;
import com.retail.inventory.exception.BadRequestException;
import com.retail.inventory.exception.ResourceNotFoundException;
import com.retail.inventory.repository.InventoryRepository;
import com.retail.inventory.repository.ProductRepository;
import com.retail.inventory.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public WarehouseService(WarehouseRepository warehouseRepository, ProductRepository productRepository, InventoryRepository inventoryRepository) {
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAllByOrderByIdAsc();
    }

    public Warehouse getWarehouseById(Long id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse with ID " + id + " not found"));
    }

    @Transactional
    public Warehouse createWarehouse(WarehouseRequest request) {
        if (warehouseRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Warehouse with code '" + request.getCode() + "' already exists!");
        }

        Warehouse warehouse = Warehouse.builder()
                .code(request.getCode())
                .name(request.getName())
                .location(request.getLocation())
                .capacity(request.getCapacity() != null ? request.getCapacity() : 1000)
                .build();

        return warehouseRepository.save(warehouse);
    }

    public List<InventoryOverviewDto> getInventoryStock() {
        return inventoryRepository.findInventoryOverview();
    }

    public List<LowStockAlertDto> getLowStockAlerts() {
        return inventoryRepository.findLowStockAlerts();
    }

    @Transactional
    public String transferStock(StockTransferRequest request) {
        if (request.getSourceWarehouseId().equals(request.getDestWarehouseId())) {
            throw new BadRequestException("Source and Destination warehouse cannot be the same!");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + request.getProductId() + " does not exist!"));

        warehouseRepository.findById(request.getSourceWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Source warehouse with ID " + request.getSourceWarehouseId() + " not found"));

        Warehouse destWarehouse = warehouseRepository.findById(request.getDestWarehouseId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination warehouse with ID " + request.getDestWarehouseId() + " not found"));

        // Lock and check source inventory
        Inventory sourceInventory = inventoryRepository.findByProductIdAndWarehouseIdWithLock(request.getProductId(), request.getSourceWarehouseId())
                .orElseThrow(() -> new BadRequestException("Insufficient stock in source warehouse to transfer!"));

        if (sourceInventory.getQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock in source warehouse to transfer!");
        }

        // Deduct from source
        sourceInventory.setQuantity(sourceInventory.getQuantity() - request.getQuantity());
        inventoryRepository.save(sourceInventory);

        // Add to destination
        Inventory destInventory = inventoryRepository.findByProductIdAndWarehouseId(request.getProductId(), request.getDestWarehouseId())
                .orElseGet(() -> Inventory.builder()
                        .product(product)
                        .warehouse(destWarehouse)
                        .quantity(0)
                        .minThreshold(10)
                        .build());

        destInventory.setQuantity(destInventory.getQuantity() + request.getQuantity());
        inventoryRepository.save(destInventory);

        return "Successfully transferred " + request.getQuantity() + " units of " + product.getName() +
                " from Warehouse #" + request.getSourceWarehouseId() + " to Warehouse #" + request.getDestWarehouseId();
    }
}
