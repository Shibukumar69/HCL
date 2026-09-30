import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/api.models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- Top Action Bar -->
      <div class="actions-header">
        <div class="search-filter">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="🔍 Search by SKU or Product Name..." 
            class="form-control search-input"
          />
          <select [(ngModel)]="selectedCategory" class="form-control select-category">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
          </select>
        </div>

        <button (click)="openAddModal()" class="btn btn-primary">
          + Add New Product
        </button>
      </div>

      <!-- Notification Alert -->
      <div *ngIf="alertMessage" class="alert-box" [class.alert-success]="alertType === 'success'" [class.alert-error]="alertType === 'error'">
        {{ alertMessage }}
      </div>

      <!-- Products Data Table -->
      <div class="card mt-3">
        <div *ngIf="loading" class="text-center py-4">
          <div class="spinner"></div>
          <p>Loading Product Catalog from MySQL...</p>
        </div>

        <div *ngIf="!loading" class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Selling Price</th>
                <th>Cost Price</th>
                <th>Profit Margin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of filteredProducts">
                <td>#{{ product.id }}</td>
                <td><span class="sku-tag">{{ product.sku }}</span></td>
                <td class="font-bold">{{ product.name }}</td>
                <td><span class="badge badge-primary">{{ product.category }}</span></td>
                <td class="font-bold text-success">$ {{ parseNumber(product.price) | number:'1.2-2' }}</td>
                <td class="text-muted">$ {{ parseNumber(product.cost_price) | number:'1.2-2' }}</td>
                <td>
                  <span class="badge badge-success">
                    +{{ calculateMargin(product) }}%
                  </span>
                </td>
                <td>
                  <button (click)="deleteProduct(product.id)" class="btn-icon-danger" title="Delete Product">
                    🗑️ Delete
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredProducts.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">
                  No products found matching your search.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Product Modal -->
      <div *ngIf="showModal" class="modal-backdrop">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Add New Retail Product</h3>
            <button (click)="closeModal()" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>SKU (Stock Keeping Unit) *</label>
              <input type="text" [(ngModel)]="newProduct.sku" placeholder="e.g. SKU-ELEC-003" class="form-control" />
            </div>
            <div class="form-group">
              <label>Product Name *</label>
              <input type="text" [(ngModel)]="newProduct.name" placeholder="e.g. POS Receipt Paper Rolls" class="form-control" />
            </div>
            <div class="form-group">
              <label>Category *</label>
              <input type="text" [(ngModel)]="newProduct.category" placeholder="e.g. Hardware, Electronics" class="form-control" />
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label>Selling Price ($) *</label>
                <input type="number" [(ngModel)]="newProduct.price" placeholder="49.99" class="form-control" />
              </div>
              <div class="form-group">
                <label>Cost Price ($)</label>
                <input type="number" [(ngModel)]="newProduct.cost_price" placeholder="25.00" class="form-control" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button (click)="closeModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="saveProduct()" [disabled]="saving" class="btn btn-primary">
              {{ saving ? 'Saving...' : 'Save Product' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { display: flex; flex-direction: column; gap: 1rem; }
    .actions-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .search-filter { display: flex; gap: 0.75rem; flex: 1; max-width: 600px; }
    .search-input { flex: 2; }
    .select-category { flex: 1; }

    .sku-tag { font-family: monospace; font-weight: 700; background: #e0e7ff; color: #3730a3; padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.8rem; }
    .btn-icon-danger { background: none; border: 1px solid var(--danger-light); color: var(--danger); padding: 0.35rem 0.75rem; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: all 0.2s; }
    .btn-icon-danger:hover { background: var(--danger); color: white; }

    .alert-box { padding: 0.75rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.875rem; margin-top: 0.5rem; }
    .alert-success { background: var(--success-light); color: #065f46; border: 1px solid #a7f3d0; }
    .alert-error { background: var(--danger-light); color: #991b1b; border: 1px solid #fecaca; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }
    .spinner { width: 32px; height: 32px; border: 3px solid var(--border-color); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 0.5rem; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .font-bold { font-weight: 700; }
    .mt-3 { margin-top: 0.75rem; }
  `]
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  searchQuery = '';
  selectedCategory = '';
  loading = true;
  saving = false;

  showModal = false;
  newProduct: Partial<Product> = { sku: '', name: '', category: '', price: 0, cost_price: 0 };

  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showAlert(err.error?.message || 'Error fetching products. Check backend.', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get categories(): string[] {
    return Array.from(new Set(this.products.map(p => p.category).filter(Boolean)));
  }

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            p.sku.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCat = this.selectedCategory ? p.category === this.selectedCategory : true;
      return matchesSearch && matchesCat;
    });
  }

  parseNumber(val: any): number {
    return Number(val || 0);
  }

  calculateMargin(product: Product): string {
    const price = this.parseNumber(product.price);
    const cost = this.parseNumber(product.cost_price);
    if (!price) return '0';
    return (((price - cost) / price) * 100).toFixed(0);
  }

  openAddModal() {
    this.newProduct = { sku: `SKU-${Date.now().toString().slice(-4)}`, name: '', category: 'General', price: 0, cost_price: 0 };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveProduct() {
    if (!this.newProduct.sku || !this.newProduct.name || !this.newProduct.price) {
      this.showAlert('Please fill in SKU, Name, and Price', 'error');
      return;
    }

    this.saving = true;
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.saving = false;
        this.closeModal();
        this.showAlert('Product added successfully to catalog!', 'success');
        this.loadProducts();
      },
      error: (err) => {
        this.saving = false;
        this.showAlert(err.error?.message || 'Failed to save product', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.showAlert('Product deleted successfully', 'success');
          this.loadProducts();
        },
        error: (err) => {
          this.showAlert(err.error?.message || 'Failed to delete product', 'error');
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
