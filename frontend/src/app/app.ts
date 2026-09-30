import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public authService = inject(AuthService);
  private router = inject(Router);
  public cdr = inject(ChangeDetectorRef);

  showLogoutToast = false;

  get currentUser() {
    return this.authService.currentUser();
  }

  logout() {
    this.authService.logout();
    this.showLogoutToast = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showLogoutToast = false;
      this.cdr.detectChanges();
      this.router.navigate(['/login']);
    }, 1000);
  }
}
