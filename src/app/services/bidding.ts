import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Crop, Bid, SellRequest } from '../models/bidding.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class BiddingService {
  private apiUrl = 'http://localhost:8089/api/bidding';

  constructor(private authService: AuthService, private http: HttpClient) {}

  // Get all available crops for bidding
  getAvailableCrops(): Observable<any> {
    console.log('BiddingService: Making API call to getAvailableCrops');
    console.log('API URL:', `${this.apiUrl}/marketplace`);
    
    // Add headers to ensure proper request
    const headers = { 'Content-Type': 'application/json' };
    
    return this.http.get(`${this.apiUrl}/marketplace`, { headers }).pipe(
      tap(response => console.log('BiddingService: API response received:', response)),
      catchError(error => {
        console.error('BiddingService: API call failed:', error);
        console.error('Error details:', error.message, error.status, error.statusText);
        throw error;
      })
    );
  }

  // Get pending crops for admin approval
  getPendingCrops(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/crops?status=pending`);
  }

  // Get crops by status
  getCropsByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/crops/status/${status}`);
  }

  // Get bidding statistics
  getBiddingStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  // Get farmer's sold history
  getFarmerSoldHistory(farmerEmail: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/farmer/crops?farmerEmail=${farmerEmail}`);
  }

  // Get bidder's bidding history
  getBidderBids(bidderEmail: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/bidder/bids?bidderEmail=${bidderEmail}`);
  }

  // Get bid history for a specific crop
  getBidHistory(cropId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/crop/${cropId}/bids`);
  }

  // Place a sell request
  placeSellRequest(request: SellRequest): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return new Observable(observer => {
        observer.next({ success: false, message: 'User not logged in' });
        observer.complete();
      });
    }
    return this.http.post(`${this.apiUrl}/sell-request?farmerEmail=${currentUser.email}`, request);
  }

  // Place a bid
  placeBid(bidData: { cropId: number; bidAmount: number }): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return new Observable(observer => {
        observer.next({ success: false, message: 'User not logged in' });
        observer.complete();
      });
    }
    
    const request = { cropId: bidData.cropId, bidAmount: bidData.bidAmount };
    console.log('Sending bid request:', { request, bidderEmail: currentUser.email });
    return this.http.post(`${this.apiUrl}/place-bid?bidderEmail=${currentUser.email}`, request);
  }

  // Admin: Approve crop
  approveCrop(cropId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/crops/${cropId}/approve`, {});
  }

  // Admin: Reject crop
  rejectCrop(cropId: number, reason: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/crops/${cropId}/reject?reason=${encodeURIComponent(reason)}`, {});
  }

  // Finalize sale (admin action)
  finalizeSale(cropId: number, winningBidId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/crop/${cropId}/sell?winningBidId=${winningBidId}`, {});
  }
}
