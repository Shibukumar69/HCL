import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/api.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <!-- Error Notification Banner if Backend Disconnected -->
      <div *ngIf="errorMessage" class="error-banner">
        <div class="error-icon">⚠️</div>
        <div class="error-details">
          <h4>Backend Connection Notice</h4>
          <p>{{ errorMessage }}</p>
          <span class="error-tip">Check if backend is running on port 5000 (<code>cd backend && npm run dev</code>)</span>
        </div>
        <button (click)="loadStats()" class="btn btn-primary">🔄 Retry Connection</button>
      </div>

      <!-- KPI Metric Cards Grid -->
      <div class="kpi-grid">
        <!-- Card 1: Products -->
        <div class="kpi-card">
          <div class="kpi-icon icon-indigo">📦</div>
          <div class="kpi-info">
            <span class="kpi-label">Total Catalog Products</span>
            <h3 class="kpi-value">{{ stats.totalProducts }}</h3>
          </div>
          <a routerLink="/products" class="kpi-link">View Catalog →</a>
        </div>

        <!-- Card 2: Warehouses -->
        <div class="kpi-card">
          <div class="kpi-icon icon-blue">🏢</div>
          <div class="kpi-info">
            <span class="kpi-label">Active Warehouses</span>
            <h3 class="kpi-value">{{ stats.totalWarehouses }}</h3>
          </div>
          <a routerLink="/inventory" class="kpi-link">Manage Locations →</a>
        </div>

        <!-- Card 3: Stock Units -->
        <div class="kpi-card">
          <div class="kpi-icon icon-emerald">📊</div>
          <div class="kpi-info">
            <span class="kpi-label">Total Stock Units</span>
            <h3 class="kpi-value">{{ stats.totalStockUnits }}</h3>
          </div>
          <span class="kpi-subtext text-success">Live synchronized</span>
        </div>

        <!-- Card 4: Low Stock Alert -->
        <div class="kpi-card" [class.alert-border]="stats.lowStockItemsCount > 0">
          <div class="kpi-icon icon-amber">⚠️</div>
          <div class="kpi-info">
            <span class="kpi-label">Low Stock Alerts</span>
            <h3 class="kpi-value" [class.text-warning]="stats.lowStockItemsCount > 0">{{ stats.lowStockItemsCount }}</h3>
          </div>
          <span class="kpi-subtext" [class.text-danger]="stats.lowStockItemsCount > 0">
            {{ stats.lowStockItemsCount > 0 ? 'Action Required' : 'All Stock Healthy' }}
          </span>
        </div>

        <!-- Card 5: Total Revenue -->
        <div class="kpi-card highlight-card">
          <div class="kpi-icon icon-purple">💰</div>
          <div class="kpi-info">
            <span class="kpi-label">Total Sales Revenue</span>
            <h3 class="kpi-value">$ {{ getRevenue() }}</h3>
          </div>
          <span class="kpi-subtext text-white-50">{{ stats.totalOrders }} Total Orders Processed</span>
        </div>
      </div>

      <!-- Quick Actions & Status Banner -->
      <div class="quick-actions-bar">
        <div class="actions-left">
          <span class="badge badge-primary">Agile Capstone P_022</span>
          <h4>Quick Retail Operations:</h4>
        </div>
        <div class="actions-buttons">
          <a routerLink="/products" class="btn btn-primary">+ Add New Product</a>
          <a routerLink="/inventory" class="btn btn-secondary">🔄 Transfer Stock</a>
          <a routerLink="/orders" class="btn btn-secondary">🛒 Fulfill Order</a>
        </div>
      </div>

      <!-- Recent Activity Table -->
      <div class="card mt-4">
        <div class="table-header">
          <h3>Recent Customer Orders</h3>
          <a routerLink="/orders" class="view-all-link">View All Orders →</a>
        </div>

        <div class="table-container mt-3">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Fulfillment Warehouse</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of stats.recentOrders">
                <td class="font-bold">{{ order.order_number }}</td>
                <td>{{ order.customer_name }}</td>
                <td><span class="badge badge-primary">{{ order.warehouse_name || 'Delhi Main Hub' }}</span></td>
                <td class="font-bold text-success">$ {{ parseAmount(order.total_amount) }}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-success': order.status === 'DELIVERED',
                    'badge-warning': order.status === 'PENDING' || order.status === 'PROCESSING',
                    'badge-primary': order.status === 'SHIPPED',
                    'badge-danger': order.status === 'CANCELLED'
                  }">
                    {{ order.status }}
                  </span>
                </td>
                <td class="text-muted">{{ order.created_at ? (order.created_at | date:'mediumDate') : 'Recent' }}</td>
              </tr>
              <tr *ngIf="!stats.recentOrders || stats.recentOrders.length === 0">
                <td colspan="6" class="text-center py-4 text-muted">
                  No customer orders found. Click "Fulfill Order" to create one!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; flex-direction: column; gap: 1.5rem; }

    .error-banner { background: #fff1f2; border: 1px solid #fecdd3; border-radius: var(--radius); padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .error-icon { font-size: 1.8rem; }
    .error-details h4 { color: #9f1239; font-size: 0.95rem; font-weight: 700; }
    .error-details p { color: #881337; font-size: 0.85rem; margin: 0.2rem 0; }
    .error-tip { font-size: 0.75rem; color: #9f1239; font-weight: 500; }
    .error-tip code { background: #ffe4e6; padding: 0.1rem 0.4rem; border-radius: 4px; font-weight: 700; }

    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; }
    .kpi-card { background: white; border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; box-shadow: var(--shadow-sm); transition: transform 0.2s, box-shadow 0.2s; }
    .kpi-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .highlight-card { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; border: none; }
    .highlight-card .kpi-label { color: rgba(255,255,255,0.8); }
    .highlight-card .kpi-value { color: white; }

    .kpi-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
    .icon-indigo { background: #e0e7ff; }
    .icon-blue { background: #e0f2fe; }
    .icon-emerald { background: #d1fae5; }
    .icon-amber { background: #fef3c7; }
    .icon-purple { background: rgba(255,255,255,0.2); }

    .kpi-info .kpi-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }
    .kpi-info .kpi-value { font-size: 1.6rem; font-weight: 800; margin-top: 0.25rem; letter-spacing: -0.02em; }
    .kpi-link { font-size: 0.8rem; color: var(--primary); font-weight: 600; text-decoration: none; }
    .kpi-link:hover { text-decoration: underline; }
    .kpi-subtext { font-size: 0.75rem; font-weight: 600; }
    .alert-border { border-left: 4px solid var(--warning); }

    .quick-actions-bar { background: white; border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1rem 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
    .actions-left { display: flex; align-items: center; gap: 1rem; }
    .actions-left h4 { font-size: 0.95rem; font-weight: 700; }
    .actions-buttons { display: flex; gap: 0.75rem; }

    .table-header { display: flex; align-items: center; justify-content: space-between; }
    .view-all-link { font-size: 0.85rem; color: var(--primary); font-weight: 600; text-decoration: none; }
    .mt-3 { margin-top: 0.75rem; }
    .mt-4 { margin-top: 1.5rem; }
    .font-bold { font-weight: 700; }
    .text-success { color: #10b981; }
    .text-warning { color: #f59e0b; }
    .text-danger { color: #ef4444; }
    .text-white-50 { color: rgba(255, 255, 255, 0.7); }
  `]
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  // Initial instant state
  stats: DashboardStats = {
    totalProducts: 0,
    totalWarehouses: 0,
    totalStockUnits: 0,
    lowStockItemsCount: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  };

  loading = true;
  errorMessage = '';

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.errorMessage = '';
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges(); // Instant UI sync across zoneless/signals
      },
      error: (err) => {
        console.error('Dashboard stats error:', err);
        this.errorMessage = 'Backend API is currently offline. Start backend on port 5000.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getRevenue(): string {
    return Number(this.stats.totalRevenue || 0).toFixed(2);
  }

  parseAmount(val: any): string {
    return Number(val || 0).toFixed(2);
  }
}
