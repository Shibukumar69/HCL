import ProductModel from '../models/Product.js';

class ProductService {
  // Saare products lane ki logic
  static async getAllProducts() {
    return await ProductModel.findAll();
  }

  // Single product fetch with check
  static async getProductById(id) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;
  }

  // Naya product create karne ki business rules validation
  static async createProduct(productData) {
    const { sku, name, price } = productData;

    if (!sku || !name || !price) {
      throw new Error('SKU, Name, and Price are mandatory fields!');
    }

    // Check karein duplicate SKU toh nahi hai
    const existingProduct = await ProductModel.findBySku(sku);
    if (existingProduct) {
      throw new Error(`Product with SKU '${sku}' already exists!`);
    }

    const newProductId = await ProductModel.create(productData);
    return await ProductModel.findById(newProductId);
  }

  // Product delete logic
  static async deleteProduct(id) {
    const isDeleted = await ProductModel.deleteById(id);
    if (!isDeleted) {
      throw new Error(`Product with ID ${id} not found to delete`);
    }
    return true;
  }
}

export default ProductService;
