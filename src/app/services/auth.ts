import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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
    return this.http.post(`${this.configService.getAuthApiUrl()}/login`, credentials);
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
    return this.http.get(`${this.configService.getAuthApiUrl()}/demo-credentials`);
  }
}
