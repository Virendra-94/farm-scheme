import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private configService: ConfigService) {
    // Check if user is logged in from localStorage (only in browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.configService.getAuthApiUrl()}/login`, credentials).pipe(
      catchError(error => {
        console.log('Backend login not available, checking frontend demo credentials');
        
        // Check if it's a demo user login
        const demoUsers = [
          {
            email: 'admin@farmscheme.com',
            password: 'admin123',
            userType: 'ADMIN',
            fullName: 'Admin User',
            id: 1,
            isActive: true,
            contactNo: '1234567890',
            createdAt: new Date()
          },
          {
            email: 'farmer@farmscheme.com',
            password: 'farmer123',
            userType: 'FARMER',
            fullName: 'Demo Farmer',
            id: 2,
            isActive: true,
            contactNo: '9876543210',
            createdAt: new Date()
          },
          {
            email: 'bidder@farmscheme.com',
            password: 'bidder123',
            userType: 'BIDDER',
            fullName: 'Demo Bidder',
            id: 3,
            isActive: true,
            contactNo: '5555555555',
            createdAt: new Date()
          }
        ];
        
        const demoUser = demoUsers.find(user => 
          user.email === credentials.email && user.password === credentials.password
        );
        
        if (demoUser) {
          // Create a mock user object
          const user: User = {
            id: demoUser.id,
            email: demoUser.email,
            fullName: demoUser.fullName,
            contactNo: demoUser.contactNo,
            userType: demoUser.userType as 'ADMIN' | 'FARMER' | 'BIDDER',
            isActive: demoUser.isActive,
            createdAt: demoUser.createdAt
          };
          
          return of({
            success: true,
            message: 'Login successful (frontend demo)',
            data: user
          });
        } else {
          return of({
            success: false,
            message: 'Invalid credentials or backend not available'
          });
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.configService.getAuthApiUrl()}/register`, userData);
  }

  logout(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.http.post(`${this.configService.getAuthApiUrl()}/logout?email=${currentUser.email}`, {}).subscribe();
    }
    this.currentUserSubject.next(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
    }
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserType(): string | null {
    const user = this.getCurrentUser();
    return user ? user.userType : null;
  }

  // Demo credentials for easy testing
  getDemoCredentials(): Observable<any> {
    return this.http.get(`${this.configService.getAuthApiUrl()}/demo-credentials`).pipe(
      catchError(error => {
        console.log('Backend demo credentials not available, using frontend fallback');
        // Return frontend demo credentials as fallback
        return of({
          success: true,
          message: 'Demo credentials retrieved successfully (frontend fallback)',
          data: {
            credentials: [
              {
                email: 'admin@farmscheme.com',
                password: 'admin123',
                userType: 'ADMIN'
              },
              {
                email: 'farmer@farmscheme.com',
                password: 'farmer123',
                userType: 'FARMER'
              },
              {
                email: 'bidder@farmscheme.com',
                password: 'bidder123',
                userType: 'BIDDER'
              }
            ]
          }
        });
      })
    );
  }
}
