import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { OrdersComponent } from './components/orders/orders.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { LoginComponent } from './components/auth/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Sign In / Register | RetailFlow' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | Retail Inventory System' },
  { path: 'products', component: ProductsComponent, title: 'Product Catalog | Retail Inventory' },
  { path: 'inventory', component: InventoryComponent, title: 'Multi-Warehouse Inventory | Retail' },
  { path: 'orders', component: OrdersComponent, title: 'Order Fulfillment | Retail Inventory' },
  { path: 'suppliers', component: SuppliersComponent, title: 'Suppliers & Vendors | Retail Inventory' },
  { path: '**', redirectTo: 'dashboard' }
];
