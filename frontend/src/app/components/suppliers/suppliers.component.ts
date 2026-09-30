import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../core/services/supplier.service';
import { Supplier } from '../../core/models/api.models';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- Header Actions -->
      <div class="actions-header">
        <div class="header-info">
          <h2>Supplier & Vendor Management</h2>
          <p class="text-muted text-sm">Manage suppliers, procurement lead times, and vendor contact profiles</p>
        </div>

        <button (click)="openAddModal()" class="btn btn-primary">
          + Add New Supplier
        </button>
      </div>

      <!-- Alert -->
      <div *ngIf="alertMessage" class="alert-box" [class.alert-success]="alertType === 'success'" [class.alert-error]="alertType === 'error'">
        {{ alertMessage }}
      </div>

      <!-- Suppliers Grid -->
      <div class="suppliers-grid mt-3">
        <div *ngIf="loading" class="text-center py-4 w-100">
          <div class="spinner"></div>
          <p>Loading suppliers...</p>
        </div>

        <div *ngFor="let supplier of suppliers" class="supplier-card">
          <div class="supplier-header">
            <div>
              <h3 class="supplier-name">{{ supplier.name }}</h3>
              <span class="badge badge-primary">Lead Time: {{ supplier.lead_time_days }} Days</span>
            </div>
            <button (click)="deleteSupplier(supplier.id)" class="btn-delete" title="Remove Supplier">🗑️</button>
          </div>

          <div class="supplier-body">
            <div class="info-row">
              <span class="info-label">👤 Contact Person:</span>
              <span class="info-value font-bold">{{ supplier.contact_person || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">✉️ Email:</span>
              <span class="info-value text-primary">{{ supplier.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📞 Phone:</span>
              <span class="info-value">{{ supplier.phone || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📍 Address:</span>
              <span class="info-value text-muted">{{ supplier.address || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="!loading && suppliers.length === 0" class="text-center py-4 w-100 text-muted">
          No suppliers registered yet.
        </div>
      </div>

      <!-- Add Supplier Modal -->
      <div *ngIf="showModal" class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Register New Supplier</h3>
            <button (click)="closeModal()" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Company / Supplier Name *</label>
              <input type="text" [(ngModel)]="newSupplier.name" placeholder="e.g. Metro Logistics Supply" class="form-control" />
            </div>
            <div class="form-group">
              <label>Contact Person</label>
              <input type="text" [(ngModel)]="newSupplier.contact_person" placeholder="e.g. Amit Sharma" class="form-control" />
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" [(ngModel)]="newSupplier.email" placeholder="vendor@metro.com" class="form-control" />
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="text" [(ngModel)]="newSupplier.phone" placeholder="+91 9876543210" class="form-control" />
              </div>
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label>Lead Time (Days)</label>
                <input type="number" [(ngModel)]="newSupplier.lead_time_days" min="1" placeholder="5" class="form-control" />
              </div>
              <div class="form-group">
                <label>Office Address</label>
                <input type="text" [(ngModel)]="newSupplier.address" placeholder="e.g. Sector 62, Noida" class="form-control" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="saveSupplier()" [disabled]="saving" class="btn btn-primary">
              {{ saving ? 'Saving...' : 'Register Supplier' }}
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

    .suppliers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; }
    .supplier-card { background: white; border: 1px solid var(--border-color); border-radius: var(--radius); padding: 1.25rem; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 1rem; transition: transform 0.2s, box-shadow 0.2s; }
    .supplier-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

    .supplier-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; }
    .supplier-name { font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem; }
    .btn-delete { background: none; border: none; font-size: 1.1rem; cursor: pointer; opacity: 0.6; transition: opacity 0.2s; }
    .btn-delete:hover { opacity: 1; }

    .supplier-body { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; }
    .info-row { display: flex; justify-content: space-between; align-items: center; }
    .info-label { color: var(--text-muted); font-size: 0.8rem; }
    .info-value { font-weight: 500; }

    .alert-box { padding: 0.75rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.875rem; margin-top: 0.5rem; }
    .alert-success { background: var(--success-light); color: #065f46; border: 1px solid #a7f3d0; }
    .alert-error { background: var(--danger-light); color: #991b1b; border: 1px solid #fecaca; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--border-color); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 0.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .font-bold { font-weight: 700; }
    .text-primary { color: var(--primary); }
    .w-100 { width: 100%; }
    .mt-3 { margin-top: 0.75rem; }
  `]
})
export class SuppliersComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private cdr = inject(ChangeDetectorRef);

  suppliers: Supplier[] = [];
  loading = true;
  saving = false;

  showModal = false;
  newSupplier: Partial<Supplier> = { name: '', contact_person: '', email: '', phone: '', address: '', lead_time_days: 5 };

  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.loading = true;
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showAlert(err.error?.message || 'Error loading suppliers. Check backend.', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddModal() {
    this.newSupplier = { name: '', contact_person: '', email: '', phone: '', address: '', lead_time_days: 5 };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveSupplier() {
    if (!this.newSupplier.name || !this.newSupplier.email) {
      this.showAlert('Please fill in Supplier Name and Email', 'error');
      return;
    }

    this.saving = true;
    this.supplierService.createSupplier(this.newSupplier).subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.showAlert('Supplier registered successfully!', 'success');
        this.loadSuppliers();
      },
      error: (err) => {
        this.saving = false;
        this.showAlert(err.error?.message || 'Failed to save supplier', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  deleteSupplier(id: number) {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(id).subscribe({
        next: () => {
          this.showAlert('Supplier removed successfully', 'success');
          this.loadSuppliers();
        },
        error: (err) => {
          this.showAlert(err.error?.message || 'Failed to delete supplier', 'error');
          this.cdr.detectChanges();
        }
      });
    }
  }

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.alertMessage = '';
      this.cdr.detectChanges();
    }, 4000);
  }
}
