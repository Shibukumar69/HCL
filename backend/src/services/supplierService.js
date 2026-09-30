import SupplierModel from '../models/Supplier.js';

class SupplierService {
  static async getAllSuppliers() {
    return await SupplierModel.findAll();
  }

  static async getSupplierById(id) {
    const supplier = await SupplierModel.findById(id);
    if (!supplier) {
      throw new Error(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  static async createSupplier(supplierData) {
    const { name, email } = supplierData;

    if (!name || !email) {
      throw new Error('Supplier Name and Email are mandatory fields!');
    }

    const existing = await SupplierModel.findByEmail(email);
    if (existing) {
      throw new Error(`Supplier with email '${email}' already registered!`);
    }

    const newId = await SupplierModel.create(supplierData);
    return await SupplierModel.findById(newId);
  }

  static async deleteSupplier(id) {
    const isDeleted = await SupplierModel.deleteById(id);
    if (!isDeleted) {
      throw new Error(`Supplier with ID ${id} not found to delete`);
    }
    return true;
  }
}

export default SupplierService;
