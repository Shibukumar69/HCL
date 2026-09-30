import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { WarehouseService } from '../../core/services/warehouse.service';
import { Order, Product, Warehouse, CreateOrderRequest } from '../../core/models/api.models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- Header Actions -->
      <div class="actions-header">
        <div class="header-info">
          <h2>Order Fulfillment & Sales</h2>
          <p class="text-muted text-sm">Create customer sales orders and manage order fulfillment lifecycle</p>
        </div>

        <button (click)="openCreateOrderModal()" class="btn btn-primary">
          + Place Customer Order
        </button>
      </div>

      <!-- Notification Alert -->
      <div *ngIf="alertMessage" class="alert-box" [class.alert-success]="alertType === 'success'" [class.alert-error]="alertType === 'error'">
        {{ alertMessage }}
      </div>

      <!-- Orders Data Table -->
      <div class="card mt-3">
        <div *ngIf="loading" class="text-center py-4">
          <div class="spinner"></div>
          <p>Loading customer orders from MySQL...</p>
        </div>

        <div *ngIf="!loading" class="table-container">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Warehouse</th>
                <th>Total Amount</th>
                <th>Order Status</th>
                <th>Change Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders">
                <td><span class="order-tag">{{ order.order_number }}</span></td>
                <td class="font-bold">{{ order.customer_name }}</td>
                <td class="text-muted">{{ order.customer_email }}</td>
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
                <td>
                  <select 
                    [ngModel]="order.status" 
                    (ngModelChange)="updateStatus(order.id, $event)" 
                    class="status-select"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
                <td class="text-muted">{{ order.created_at ? (order.created_at | date:'mediumDate') : 'Recent' }}</td>
              </tr>
              <tr *ngIf="orders.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  No orders recorded yet.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Order Modal -->
      <div *ngIf="showModal" class="modal-backdrop">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3>🛒 Place Customer Sales Order</h3>
            <button (click)="closeModal()" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="grid-2">
              <div class="form-group">
                <label>Customer Name *</label>
                <input type="text" [(ngModel)]="newOrder.customerName" placeholder="e.g. Rajesh Kumar" class="form-control" />
              </div>
              <div class="form-group">
                <label>Customer Email *</label>
                <input type="email" [(ngModel)]="newOrder.customerEmail" placeholder="rajesh@gmail.com" class="form-control" />
              </div>
            </div>

            <div class="form-group">
              <label>Fulfillment Warehouse *</label>
              <select [(ngModel)]="newOrder.warehouseId" class="form-control">
                <option [ngValue]="0">-- Select Warehouse for Stock Deduction --</option>
                <option *ngFor="let wh of warehouses" [value]="wh.id">{{ wh.name }} ({{ wh.location }})</option>
              </select>
            </div>

            <hr class="divider" />

            <!-- Order Items -->
            <div class="items-section">
              <div class="items-header">
                <h4>Order Line Items</h4>
                <button (click)="addItemRow()" class="btn-sm btn-secondary">+ Add Another Item</button>
              </div>

              <div *ngFor="let item of newOrder.items; let i = index" class="item-row">
                <div class="form-group flex-2">
                  <label>Product</label>
                  <select [(ngModel)]="item.productId" class="form-control">
                    <option [ngValue]="0">-- Select Product --</option>
                    <option *ngFor="let p of products" [value]="p.id">
                      {{ p.name }} ($ {{ p.price }})
                    </option>
                  </select>
                </div>
                <div class="form-group flex-1">
                  <label>Quantity</label>
                  <input type="number" [(ngModel)]="item.quantity" min="1" class="form-control" />
                </div>
                <button *ngIf="newOrder.items.length > 1" (click)="removeItemRow(i)" class="btn-remove">✕</button>
              </div>
            </div>

            <div class="order-summary-box">
              <span>Estimated Order Total:</span>
              <span class="total-price">$ {{ calculateTotal() | number:'1.2-2' }}</span>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="submitOrder()" [disabled]="submitting" class="btn btn-primary">
              {{ submitting ? 'Processing Order...' : 'Confirm & Place Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 1rem; }
    .actions-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .header-info h2 { font-size: 1.25rem; font-weight: 700; }
    .text-sm { font-size: 0.85rem; }

    .order-tag { font-family: monospace; font-weight: 700; background: #f1f5f9; color: #0f172a; padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.85rem; border: 1px solid var(--border-color); }
    .status-select { padding: 0.35rem 0.6rem; border-radius: 6px; border: 1px solid var(--border-color); font-size: 0.8rem; font-weight: 600; cursor: pointer; background: white; }

    .alert-box { padding: 0.75rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.875rem; margin-top: 0.5rem; }
    .alert-success { background: var(--success-light); color: #065f46; border: 1px solid #a7f3d0; }
    .alert-error { background: var(--danger-light); color: #991b1b; border: 1px solid #fecaca; }

    .modal-lg { max-width: 600px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .divider { border: 0; border-top: 1px solid var(--border-color); margin: 0.5rem 0; }
    
    .items-section { display: flex; flex-direction: column; gap: 0.75rem; }
    .items-header { display: flex; justify-content: space-between; align-items: center; }
    .items-header h4 { font-size: 0.95rem; font-weight: 700; }
    .btn-sm { padding: 0.35rem 0.75rem; border-radius: 6px; font-size: 0.75rem; }

    .item-row { display: flex; gap: 0.75rem; align-items: flex-end; }
    .flex-2 { flex: 2; }
    .flex-1 { flex: 1; }
    .btn-remove { background: #fee2e2; color: #ef4444; border: none; border-radius: 6px; padding: 0.65rem 0.75rem; cursor: pointer; font-weight: 700; }

    .order-summary-box { background: #eef2ff; border: 1px solid #c7d2fe; padding: 1rem; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; font-weight: 700; margin-top: 0.5rem; }
    .total-price { font-size: 1.25rem; color: var(--primary); }

    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--border-color); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 0.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .font-bold { font-weight: 700; }
    .mt-3 { margin-top: 0.75rem; }
  `]
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private warehouseService = inject(WarehouseService);
  private cdr = inject(ChangeDetectorRef);

  orders: Order[] = [];
  products: Product[] = [];
  warehouses: Warehouse[] = [];
  loading = true;
  submitting = false;

  showModal = false;
  newOrder: CreateOrderRequest = {
    customerName: '',
    customerEmail: '',
    warehouseId: 0,
    items: [{ productId: 0, quantity: 1 }]
  };

  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  ngOnInit() {
    this.loadOrders();
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      this.cdr.detectChanges();
    });
    this.warehouseService.getWarehouses().subscribe(data => {
      this.warehouses = data;
      this.cdr.detectChanges();
    });
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showAlert(err.error?.message || 'Error loading orders. Check backend.', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  parseAmount(val: any): string {
    return Number(val || 0).toFixed(2);
  }

  openCreateOrderModal() {
    this.newOrder = {
      customerName: '',
      customerEmail: '',
      warehouseId: this.warehouses.length ? this.warehouses[0].id : 0,
      items: [{ productId: this.products.length ? this.products[0].id : 0, quantity: 1 }]
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  addItemRow() {
    this.newOrder.items.push({ productId: this.products.length ? this.products[0].id : 0, quantity: 1 });
  }

  removeItemRow(index: number) {
    this.newOrder.items.splice(index, 1);
  }

  calculateTotal(): number {
    let total = 0;
    for (const item of this.newOrder.items) {
      const prod = this.products.find(p => p.id === Number(item.productId));
      if (prod) {
        total += prod.price * Number(item.quantity || 0);
      }
    }
    return total;
  }

  submitOrder() {
    if (!this.newOrder.customerName || !this.newOrder.customerEmail || !this.newOrder.warehouseId) {
      this.showAlert('Please fill in customer details and select a warehouse', 'error');
      return;
    }

    this.submitting = true;
    this.orderService.createOrder(this.newOrder).subscribe({
      next: () => {
        this.submitting = false;
        this.closeModal();
        this.showAlert('Order placed successfully & inventory stock deducted!', 'success');
        this.loadOrders();
      },
      error: (err) => {
        this.submitting = false;
        this.showAlert(err.error?.message || 'Failed to place order. Check stock availability.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  updateStatus(orderId: number, newStatus: string) {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        this.showAlert(`Order #${orderId} status updated to ${newStatus}`, 'success');
        this.loadOrders();
      },
      error: (err) => {
        this.showAlert(err.error?.message || 'Failed to update order status', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.alertMessage = '';
      this.cdr.detectChanges();
    }, 4500);
  }
}
