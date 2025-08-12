import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Check if user is logged in
    if (this.authService.isLoggedIn()) {
      const currentUser = this.authService.getCurrentUser();
      // Additional check to ensure user data is valid
      if (currentUser && currentUser.userType) {
        return true;
      }
    }
    
    // If not logged in or invalid user data, redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
