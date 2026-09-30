import ProductService from '../services/productService.js';

// 1. GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 2. GET /api/products/:id
export const getProduct = async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// 3. POST /api/products
export const createProduct = async (req, res) => {
  try {
    const newProduct = await ProductService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully in database!',
      data: newProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// 4. DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.status(200).json({
      success: true,
      message: `Product ${req.params.id} deleted successfully!`
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
