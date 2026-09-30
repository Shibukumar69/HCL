import WarehouseModel from '../models/warehouse.js';
import ProductModel from '../models/Product.js';

class WarehouseService {
  // 1. Saare warehouses fetch karna
  static async getAllWarehouses() {
    return await WarehouseModel.findAll();
  }

  // 2. Single warehouse fetch
  static async getWarehouseById(id) {
    const warehouse = await WarehouseModel.findById(id);
    if (!warehouse) {
      throw new Error(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  // 3. Naya warehouse create karna
  static async createWarehouse(warehouseData) {
    const { code, name, location } = warehouseData;

    if (!code || !name || !location) {
      throw new Error('Warehouse Code, Name, and Location are required!');
    }

    const existing = await WarehouseModel.findByCode(code);
    if (existing) {
      throw new Error(`Warehouse with code '${code}' already exists!`);
    }

    const newId = await WarehouseModel.create(warehouseData);
    return await WarehouseModel.findById(newId);
  }

  // 4. Overall Inventory stock view
  static async getInventoryStock() {
    return await WarehouseModel.getInventoryOverview();
  }

  // 5. Low stock alerts
  static async getLowStockAlerts() {
    return await WarehouseModel.getLowStockAlerts();
  }

  // 6. Stock transfer validation & business logic
  static async transferStock({ productId, sourceWarehouseId, destWarehouseId, quantity }) {
    if (!productId || !sourceWarehouseId || !destWarehouseId || !quantity) {
      throw new Error('ProductId, SourceWarehouseId, DestWarehouseId, and Quantity are required!');
    }

    if (sourceWarehouseId === destWarehouseId) {
      throw new Error('Source and Destination warehouse cannot be the same!');
    }

    if (Number(quantity) <= 0) {
      throw new Error('Transfer quantity must be greater than 0!');
    }

    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} does not exist!`);
    }

    // Perform atomic transaction
    await WarehouseModel.transferStock(
      Number(productId),
      Number(sourceWarehouseId),
      Number(destWarehouseId),
      Number(quantity)
    );

    return {
      message: `Successfully transferred ${quantity} units of ${product.name} from Warehouse #${sourceWarehouseId} to Warehouse #${destWarehouseId}`
    };
  }
}

export default WarehouseService;
