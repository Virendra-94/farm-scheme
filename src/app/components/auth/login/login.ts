import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { LoginRequest } from '../../../models/user.model';
import { Subject, takeUntil, timeout, catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnDestroy {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  isLoading = false;
  showPassword = false;
  showError = false;
  errorMessage = '';
  successMessage = '';
  //demoCredentials: { email: string; password: string; userType: string }[] = [];
  //  Demo credentials for different user types (fallback if backend is not available)
  demoCredentials: { email: string; password: string; userType: string }[] = [
    { email: 'admin@farmscheme.com', password: 'admin123', userType: 'ADMIN' },
    { email: 'farmer@farmscheme.com', password: 'farmer123', userType: 'FARMER' },
    { email: 'bidder@farmscheme.com', password: 'bidder123', userType: 'BIDDER' }
  ];
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.getDemoCredentials().pipe(
      takeUntil(this.destroy$),
      timeout(10000), // 10 second timeout
      catchError(error => {
        console.error('Error loading demo credentials:', error);
        return of({ success: false, data: { credentials: [] } });
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.demoCredentials = response.data.credentials;
        }
      },
      error: (error) => {
        console.error('Error loading demo credentials:', error);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.showError = false;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.loginData.email || !this.loginData.password) {
      this.showError = true;
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    console.log('Attempting login with:', this.loginData.email);
    this.isLoading = true;

    this.authService.login(this.loginData).pipe(
      takeUntil(this.destroy$),
      timeout(15000), // 15 second timeout for login
      catchError(error => {
        console.error('Login error:', error);
        return of({ success: false, message: 'Login failed. Please check your connection and try again.' });
      })
    ).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message;
          // Store user in auth service
          this.authService.setCurrentUser(response.data);
          console.log('User stored, redirecting to:', response.data?.userType);
          // Redirect based on user type
          setTimeout(() => {
            const userType = response.data?.userType;
            switch (userType) {
              case 'ADMIN':
                this.router.navigate(['/admin']);
                break;
              case 'FARMER':
                this.router.navigate(['/farmer']);
                break;
              case 'BIDDER':
                this.router.navigate(['/bidder']);
                break;
              default:
                this.router.navigate(['/']);
            }
          }, 1000);
        } else {
          this.showError = true;
          this.errorMessage = response.message || 'Login failed. Please try again.';
        }
      },
      error: (error) => {
        console.error('Login error in subscribe:', error);
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = 'An error occurred. Please try again.';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  fillDemoCredentials(cred: { email: string; password: string; userType: string }) {
    this.loginData.email = cred.email;
    this.loginData.password = cred.password;
  }
}
