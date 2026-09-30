import WarehouseService from '../services/warehouseService.js';

// 1. GET /api/warehouses
export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await WarehouseService.getAllWarehouses();
    res.status(200).json({
      success: true,
      count: warehouses.length,
      data: warehouses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET /api/warehouses/:id
export const getWarehouse = async (req, res) => {
  try {
    const warehouse = await WarehouseService.getWarehouseById(req.params.id);
    res.status(200).json({ success: true, data: warehouse });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// 3. POST /api/warehouses
export const createWarehouse = async (req, res) => {
  try {
    const newWarehouse = await WarehouseService.createWarehouse(req.body);
    res.status(201).json({
      success: true,
      message: 'Warehouse registered successfully!',
      data: newWarehouse
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 4. GET /api/warehouses/inventory/overview
export const getInventoryOverview = async (req, res) => {
  try {
    const stock = await WarehouseService.getInventoryStock();
    res.status(200).json({
      success: true,
      count: stock.length,
      data: stock
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. GET /api/warehouses/inventory/low-stock
export const getLowStockAlerts = async (req, res) => {
  try {
    const alerts = await WarehouseService.getLowStockAlerts();
    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. POST /api/warehouses/inventory/transfer
export const transferStock = async (req, res) => {
  try {
    const result = await WarehouseService.transferStock(req.body);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
