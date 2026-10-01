package com.retail.inventory.repository;

import com.retail.inventory.dto.InventoryOverviewDto;
import com.retail.inventory.dto.LowStockAlertDto;
import com.retail.inventory.entity.Inventory;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductIdAndWarehouseId(Long productId, Long warehouseId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventory i WHERE i.product.id = :productId AND i.warehouse.id = :warehouseId")
    Optional<Inventory> findByProductIdAndWarehouseIdWithLock(@Param("productId") Long productId, @Param("warehouseId") Long warehouseId);

    @Query("SELECT new com.retail.inventory.dto.InventoryOverviewDto(" +
           "i.id, p.id, p.sku, p.name, p.category, p.price, " +
           "w.id, w.code, w.name, w.location, i.quantity, i.minThreshold, " +
           "CASE WHEN i.quantity <= i.minThreshold THEN 'LOW_STOCK' ELSE 'IN_STOCK' END) " +
           "FROM Inventory i " +
           "JOIN i.product p " +
           "JOIN i.warehouse w " +
           "ORDER BY w.name ASC, p.name ASC")
    List<InventoryOverviewDto> findInventoryOverview();

    @Query("SELECT new com.retail.inventory.dto.LowStockAlertDto(" +
           "p.sku, p.name, w.code, w.name, i.quantity, i.minThreshold) " +
           "FROM Inventory i " +
           "JOIN i.product p " +
           "JOIN i.warehouse w " +
           "WHERE i.quantity <= i.minThreshold")
    List<LowStockAlertDto> findLowStockAlerts();

    @Query("SELECT COALESCE(SUM(i.quantity), 0) FROM Inventory i")
    Long sumTotalQuantity();

    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.quantity <= i.minThreshold")
    Long countLowStockItems();
}
