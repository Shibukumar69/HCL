export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  message?: string;
  data: T;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  location: string;
  capacity: number;
  created_at?: string;
}

export interface InventoryItem {
  inventory_id: number;
  product_id: number;
  sku: string;
  product_name: string;
  category: string;
  price: number;
  warehouse_id: number;
  warehouse_code: string;
  warehouse_name: string;
  location: string;
  quantity: number;
  min_threshold: number;
  stock_status: 'IN_STOCK' | 'LOW_STOCK';
}

export interface StockTransferRequest {
  productId: number;
  sourceWarehouseId: number;
  destWarehouseId: number;
  quantity: number;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  lead_time_days: number;
  created_at?: string;
}

export interface OrderItem {
  id?: number;
  productId: number;
  product_name?: string;
  sku?: string;
  quantity: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  warehouse_id: number;
  warehouse_name?: string;
  total_amount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  created_at: string;
  items?: OrderItem[];
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  warehouseId: number;
  items: { productId: number; quantity: number }[];
}

export interface DashboardStats {
  totalProducts: number;
  totalWarehouses: number;
  totalStockUnits: number;
  lowStockItemsCount: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'WAREHOUSE_MANAGER' | 'STAFF';
  created_at?: string;
}
