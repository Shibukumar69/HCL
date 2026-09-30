import SupplierService from '../services/supplierService.js';

// 1. GET /api/suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await SupplierService.getAllSuppliers();
    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET /api/suppliers/:id
export const getSupplier = async (req, res) => {
  try {
    const supplier = await SupplierService.getSupplierById(req.params.id);
    res.status(200).json({ success: true, data: supplier });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// 3. POST /api/suppliers
export const createSupplier = async (req, res) => {
  try {
    const newSupplier = await SupplierService.createSupplier(req.body);
    res.status(201).json({
      success: true,
      message: 'Supplier created successfully!',
      data: newSupplier
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 4. DELETE /api/suppliers/:id
export const deleteSupplier = async (req, res) => {
  try {
    await SupplierService.deleteSupplier(req.params.id);
    res.status(200).json({
      success: true,
      message: `Supplier #${req.params.id} deleted successfully!`
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
