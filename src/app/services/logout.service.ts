import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    // Clear authentication state
    this.authService.logout();
    
    // Navigate to home page without forcing reload
    this.router.navigate(['/']);
  }
}
