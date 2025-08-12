import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserDetails {
  id: number;
  fullName: string;
  email: string;
  contactNo: string;
  userType: 'ADMIN' | 'FARMER' | 'BIDDER';
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  address?: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pinCode: string;
  };
  bankDetails?: {
    accountNo: string;
    ifscCode: string;
  };
  documents?: {
    aadhaar: string;
    pan: string;
    landCertificate?: string;
  };
  landDetails?: {
    area: number;
    address: string;
    pinCode: string;
  };
  traderLicense?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = 'http://localhost:8089/api/users';

  constructor(private http: HttpClient) { }

  // ==================== USER MANAGEMENT ENDPOINTS ====================

  // Get all users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Get users by type
  getUsersByType(userType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/type/${userType}`);
  }

  // Get users by status
  getUsersByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${status}`);
  }

  // Get user by ID
  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // Update user status
  updateUserStatus(userId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/status?status=${status}`, {});
  }

  // Delete user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  // ==================== SEARCH ENDPOINTS ====================

  // Search users
  searchUsers(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?query=${encodeURIComponent(query)}`);
  }

  // ==================== STATISTICS ENDPOINTS ====================

  // Get user statistics
  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
