import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { LogoutService } from '../../../services/logout.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  showUserMenu = false;
  showMobileMenu = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private logoutService: LogoutService
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-trigger')) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  logout() {
    // Close menus first
    this.showUserMenu = false;
    this.showMobileMenu = false;
    
    // Use centralized logout service
    this.logoutService.logout();
  }
}
