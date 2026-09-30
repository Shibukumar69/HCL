import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <!-- Brand Header -->
        <div class="auth-header">
          <div class="auth-logo">📦</div>
          <h2>RetailFlow Management</h2>
          <p class="text-muted">Agile Capstone Case Study (P_022)</p>
        </div>

        <!-- Auth Tabs (Login / Register) -->
        <div class="auth-tabs">
          <button (click)="isRegisterMode = false" [class.active]="!isRegisterMode" class="tab-btn">
            Sign In
          </button>
          <button (click)="isRegisterMode = true" [class.active]="isRegisterMode" class="tab-btn">
            Create Account
          </button>
        </div>

        <!-- Alert Notification -->
        <div *ngIf="alertMessage" class="alert-box" [class.alert-success]="alertType === 'success'" [class.alert-error]="alertType === 'error'">
          {{ alertMessage }}
        </div>

        <!-- LOGIN FORM -->
        <form *ngIf="!isRegisterMode" (ngSubmit)="handleLogin()" class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="loginData.email" name="email" placeholder="admin@retail.com" class="form-control" required />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="loginData.password" name="password" placeholder="••••••••" class="form-control" required />
          </div>

          <button type="submit" [disabled]="submitting" class="btn btn-primary w-100 btn-submit">
            {{ submitting ? 'Signing In...' : 'Sign In to Dashboard' }}
          </button>
        </form>

        <!-- REGISTER (SIGNUP) FORM -->
        <form *ngIf="isRegisterMode" (ngSubmit)="handleRegister()" class="auth-form">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="registerData.name" name="name" placeholder="e.g. Ramesh Patel" class="form-control" required />
          </div>

          <div class="form-group">
            <label>Work Email</label>
            <input type="email" [(ngModel)]="registerData.email" name="regEmail" placeholder="ramesh@retail.com" class="form-control" required />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="registerData.password" name="regPassword" placeholder="Minimum 6 characters" class="form-control" required />
          </div>

          <div class="form-group">
            <label>Select Role (Agile RBAC)</label>
            <select [(ngModel)]="registerData.role" name="role" class="form-control">
              <option value="ADMIN">👑 System Admin (Full Privileges)</option>
              <option value="WAREHOUSE_MANAGER">🏢 Warehouse Manager (Inventory & Transfers)</option>
              <option value="STAFF">🛒 Cashier / Sales Staff (Orders & Catalog)</option>
            </select>
          </div>

          <button type="submit" [disabled]="submitting" class="btn btn-primary w-100 btn-submit">
            {{ submitting ? 'Creating Account...' : 'Register & Get Started' }}
          </button>
        </form>

        <!-- Quick 1-Click Demo Accounts -->
        <div class="quick-demo-section">
          <div class="divider"><span>Or Quick 1-Click Demo Login</span></div>
          <div class="demo-grid">
            <button (click)="quickLogin('admin@retail.com', 'Password123')" class="demo-btn">
              👑 Login as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .auth-card { background: white; border: 1px solid var(--border-color); border-radius: 16px; width: 100%; max-width: 440px; padding: 2rem; box-shadow: var(--shadow-lg); }

    .auth-header { text-align: center; margin-bottom: 1.5rem; }
    .auth-logo { width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary), #0ea5e9); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: white; margin: 0 auto 0.75rem; box-shadow: 0 4px 12px var(--primary-glow); }
    .auth-header h2 { font-size: 1.35rem; font-weight: 800; color: var(--text-main); }

    .auth-tabs { display: flex; background: var(--bg-app); border-radius: 10px; padding: 0.3rem; margin-bottom: 1.5rem; border: 1px solid var(--border-color); }
    .tab-btn { flex: 1; padding: 0.6rem; border: none; background: none; font-weight: 600; font-size: 0.85rem; color: var(--text-muted); border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .tab-btn.active { background: white; color: var(--primary); box-shadow: var(--shadow-sm); font-weight: 700; }

    .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
    .btn-submit { padding: 0.8rem; font-size: 0.95rem; justify-content: center; margin-top: 0.5rem; }
    .w-100 { width: 100%; }

    .alert-box { padding: 0.75rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; margin-bottom: 1rem; }
    .alert-success { background: var(--success-light); color: #065f46; border: 1px solid #a7f3d0; }
    .alert-error { background: var(--danger-light); color: #991b1b; border: 1px solid #fecaca; }

    .quick-demo-section { margin-top: 1.75rem; }
    .divider { text-align: center; position: relative; margin-bottom: 1rem; }
    .divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--border-color); }
    .divider span { position: relative; background: white; padding: 0 0.75rem; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

    .demo-grid { display: flex; flex-direction: column; gap: 0.5rem; }
    .demo-btn { background: #f8fafc; border: 1px solid var(--border-color); padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: left; }
    .demo-btn:hover { background: #eef2ff; border-color: #c7d2fe; color: var(--primary); }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isRegisterMode = false;
  submitting = false;

  loginData = { email: 'admin@retail.com', password: 'Password123' };
  registerData = { name: '', email: '', password: '', role: 'STAFF' };

  alertMessage = '';
  alertType: 'success' | 'error' = 'success';

  handleLogin() {
    if (!this.loginData.email || !this.loginData.password) {
      this.showAlert('Please enter email and password', 'error');
      return;
    }

    this.submitting = true;
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.submitting = false;
        this.showAlert('Login successful! Redirecting to Dashboard...', 'success');
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 800);
      },
      error: (err) => {
        this.submitting = false;
        this.showAlert(err.error?.message || 'Invalid email or password. Check backend.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  handleRegister() {
    if (!this.registerData.name || !this.registerData.email || !this.registerData.password) {
      this.showAlert('Please fill in all registration fields', 'error');
      return;
    }

    this.submitting = true;
    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.submitting = false;
        this.showAlert('Account created successfully! Redirecting...', 'success');
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 800);
      },
      error: (err) => {
        this.submitting = false;
        this.showAlert(err.error?.message || 'Registration failed. Try again.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  quickLogin(email: string, pass: string) {
    this.loginData = { email, password: pass };
    this.handleLogin();
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
