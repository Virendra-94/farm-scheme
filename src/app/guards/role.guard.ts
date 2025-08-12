import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private redirectCount = 0;
  private readonly MAX_REDIRECTS = 5;

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if the route requires a specific user type
    const requiredRole = route.data['role'];
    
    if (requiredRole && currentUser.userType !== requiredRole) {
      // Prevent infinite redirect loops
      if (this.redirectCount >= this.MAX_REDIRECTS) {
        console.error('Maximum redirects reached, redirecting to home');
        this.redirectCount = 0;
        this.router.navigate(['/']);
        return false;
      }
      
      this.redirectCount++;
      
      // Redirect to appropriate dashboard based on user type
      switch (currentUser.userType) {
        case 'FARMER':
          this.router.navigate(['/farmer']);
          break;
        case 'BIDDER':
          this.router.navigate(['/bidder']);
          break;
        case 'ADMIN':
          this.router.navigate(['/admin']);
          break;
        default:
          this.router.navigate(['/']);
      }
      return false;
    }

    // Reset redirect count on successful navigation
    this.redirectCount = 0;
    return true;
  }
}
