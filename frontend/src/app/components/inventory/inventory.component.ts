import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseService } from '../../core/services/warehouse.service';
import { InventoryItem, Warehouse, StockTransferRequest } from '../../core/models/api.models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- Header Actions -->
      <div class="actions-header">
        <div class="filters">
          <button 
            (click)="filterLowStock = false; cdr.detectChanges()" 
            class="tab-btn" 
            [class.active]="!filterLowStock"
          >
            All Stock Overview ({{ inventory.length }})
          </button>
          <button 
            (click)="filterLowStock = true; cdr.detectChanges()" 
            class="tab-btn alert-tab" 
            [class.active]="filterLowStock"
          >
            ⚠️ Low Stock Items ({{ lowStockCount }})
          </button>
        </div>

        <button (click)="openTransferModal()" class="btn btn-primary">
          🔄 Inter-Warehouse Stock Transfer
        </button>
      </div>

      <!-- Notification Alert -->
      <div *ngIf="alertMessage" class="alert-box" [class.alert-success]="alertType === 'success'" [class.alert-error]="alertType === 'error'">
        {{ alertMessage }}
      </div>

      <!-- Inventory Table -->
      <div class="card mt-3">
        <div *ngIf="loading" class="text-center py-4">
          <div class="spinner"></div>
          <p>Loading multi-warehouse inventory from MySQL...</p>
        </div>

        <div *ngIf="!loading" class="table-container">
          <table>
            <thead>
              <tr>
                <th>Warehouse Location</th>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Available Quantity</th>
                <th>Min Threshold</th>
                <th>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of displayedInventory">
                <td>
                  <div class="wh-meta">
                    <span class="font-bold">{{ item.warehouse_name }}</span>
                    <span class="text-muted text-xs">{{ item.location }} ({{ item.warehouse_code }})</span>
                  </div>
                </td>
                <td><span class="sku-tag">{{ item.sku }}</span></td>
                <td class="font-bold">{{ item.product_name }}</td>
                <td><span class="badge badge-primary">{{ item.category }}</span></td>
                <td>
                  <span class="qty-badge font-bold" [class.qty-low]="item.quantity <= item.min_threshold">
                    {{ item.quantity }} Units
                  </span>
                </td>
                <td class="text-muted">{{ item.min_threshold }} Units</td>
                <td>
                  <span class="badge" [ngClass]="item.stock_status === 'IN_STOCK' ? 'badge-success' : 'badge-danger'">
                    {{ item.stock_status === 'IN_STOCK' ? 'In Stock' : 'Low Stock' }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="displayedInventory.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">
                  No inventory records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Inter-Warehouse Stock Transfer Modal -->
      <div *ngIf="showTransferModal" class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-header">
            <h3>🔄 Transfer Stock Between Warehouses</h3>
            <button (click)="closeTransferModal()" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Select Product *</label>
              <select [(ngModel)]="transferData.productId" class="form-control">
                <option [ngValue]="0">-- Select Product to Transfer --</option>
                <option *ngFor="let item of uniqueProducts" [value]="item.product_id">
                  {{ item.product_name }} (SKU: {{ item.sku }})
                </option>
              </select>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label>From (Source Warehouse) *</label>
                <select [(ngModel)]="transferData.sourceWarehouseId" class="form-control">
                  <option [ngValue]="0">-- Source --</option>
                  <option *ngFor="let wh of warehouses" [value]="wh.id">{{ wh.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>To (Destination Warehouse) *</label>
                <select [(ngModel)]="transferData.destWarehouseId" class="form-control">
                  <option [ngValue]="0">-- Destination --</option>
                  <option *ngFor="let wh of warehouses" [value]="wh.id">{{ wh.name }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Transfer Quantity (Units) *</label>
              <input type="number" [(ngModel)]="transferData.quantity" min="1" placeholder="e.g. 10" class="form-control" />
            </div>

            <div class="transfer-notice">
              ℹ️ Transfer is protected by <strong>ACID Database Transactions</strong> to guarantee stock accuracy.
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeTransferModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="executeTransfer()" [disabled]="transferring" class="btn btn-primary">
              {{ transferring ? 'Transferring...' : 'Execute Stock Transfer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 1rem; }
    .actions-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .filters { display: flex; gap: 0.5rem; }
    .tab-btn { padding: 0.6rem 1.2rem; border-radius: 8px; border: 1px solid var(--border-color); background: white; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
    .tab-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
    .alert-tab.active { background: var(--warning); border-color: var(--warning); color: #78350f; }

    .wh-meta { display: flex; flex-direction: column; }
    .text-xs { font-size: 0.75rem; }
    .sku-tag { font-family: monospace; font-weight: 700; background: #e0e7ff; color: #3730a3; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.8rem; }
    .qty-badge { padding: 0.3rem 0.6rem; border-radius: 6px; background: #ecfdf5; color: #065f46; }
    .qty-low { background: #fee2e2; color: #991b1b; }

    .alert-box { padding: 0.75rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.875rem; margin-top: 0.5rem; }
    .alert-success { background: var(--success-light); color: #065f46; border: 1px solid #a7f3d0; }
    .alert-error { background: var(--danger-light); color: #991b1b; border: 1px solid #fecaca; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .transfer-notice { font-size: 0.8rem; color: var(--text-muted); background: #f8fafc; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--border-color); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 0.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .font-bold { font-weight: 700; }
    .mt-3 { margin-top: 0.75rem; }
  `]
})
export class InventoryComponent implements OnInit {
  private warehouseService = inject(WarehouseService);
  public cdr = inject(ChangeDetectorRef);

  inventory: InventoryItem[] = [];
  warehouses: Warehouse[] = [];
  filterLowStock = false;
  loading = true;
  transferring = false;

  showTransferModal = false;
  transferData: StockTransferRequest = { productId: 0, sourceWarehouseId: 0, destWarehouseId: 0, quantity: 1 };

  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.warehouseService.getInventoryOverview().subscribe({
      next: (data) => {
        this.inventory = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showAlert(err.error?.message || 'Error loading inventory. Check backend.', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.warehouseService.getWarehouses().subscribe({
      next: (whs) => {
        this.warehouses = whs;
        this.cdr.detectChanges();
      }
    });
  }

  get displayedInventory(): InventoryItem[] {
    if (this.filterLowStock) {
      return this.inventory.filter(i => i.quantity <= i.min_threshold);
    }
    return this.inventory;
  }

  get lowStockCount(): number {
    return this.inventory.filter(i => i.quantity <= i.min_threshold).length;
  }

  get uniqueProducts() {
    const map = new Map<number, InventoryItem>();
    for (const item of this.inventory) {
      if (!map.has(item.product_id)) {
        map.set(item.product_id, item);
      }
    }
    return Array.from(map.values());
  }

  openTransferModal() {
    this.transferData = { productId: 0, sourceWarehouseId: 0, destWarehouseId: 0, quantity: 1 };
    this.showTransferModal = true;
  }

  closeTransferModal() {
    this.showTransferModal = false;
  }

  executeTransfer() {
    if (!this.transferData.productId || !this.transferData.sourceWarehouseId || !this.transferData.destWarehouseId) {
      this.showAlert('Please select Product, Source, and Destination Warehouse', 'error');
      return;
    }
    if (this.transferData.sourceWarehouseId === this.transferData.destWarehouseId) {
      this.showAlert('Source and Destination warehouse cannot be the same!', 'error');
      return;
    }

    this.transferring = true;
    this.warehouseService.transferStock(this.transferData).subscribe({
      next: (res) => {
        this.transferring = false;
        this.closeTransferModal();
        this.showAlert(res.message, 'success');
        this.loadData();
      },
      error: (err) => {
        this.transferring = false;
        this.showAlert(err.error?.message || 'Stock transfer failed', 'error');
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
    }, 5000);
  }
}
