import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  // Get user statistics
  getUserStats(): Observable<any> {
    // This should call the backend API instead of using demo data
    return of({
      totalUsers: 0,
      activeUsers: 0,
      farmers: 0,
      bidders: 0,
      admins: 0
    });
  }

  // Get users by type
  getUsersByType(userType: string): Observable<any> {
    // This should call the backend API instead of using demo data
    return of([]);
  }
}
