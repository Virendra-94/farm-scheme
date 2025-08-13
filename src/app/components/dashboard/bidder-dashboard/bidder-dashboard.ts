import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { BiddingService } from '../../../services/bidding';
import { User } from '../../../models/user.model';
import { Crop, Bid } from '../../../models/bidding.model';
import { Subject, takeUntil, timeout, catchError, of } from 'rxjs';

@Component({
  selector: 'app-bidder-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bidder-dashboard.html',
  styleUrl: './bidder-dashboard.css'
})
export class BidderDashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  availableCrops: Crop[] = [];
  myBids: Bid[] = [];
  isLoading = false;
  stats = {
    totalBids: 0,
    activeBids: 0,
    wonBids: 0,
    totalSpent: 0
  };

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private biddingService: BiddingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.userType !== 'BIDDER') {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadDashboardData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Load available crops for bidding
    this.biddingService.getAvailableCrops().pipe(
      takeUntil(this.destroy$),
      timeout(10000), // 10 second timeout
      catchError(error => {
        console.error('Error loading crops:', error);
        return of({ success: false, data: [] });
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.availableCrops = response.data || [];
        } else {
          this.availableCrops = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading crops:', error);
        this.availableCrops = [];
        this.isLoading = false;
      }
    });

    // Load bidder's bidding history
    this.biddingService.getBidderBids(this.currentUser!.email).pipe(
      takeUntil(this.destroy$),
      timeout(10000),
      catchError(error => {
        console.error('Error loading bids:', error);
        return of({ success: false, data: [] });
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.myBids = response.data || [];
        } else {
          this.myBids = [];
        }
        this.calculateStats();
      },
      error: (error) => {
        console.error('Error loading bids:', error);
        this.myBids = [];
        this.calculateStats();
      }
    });
  }

  calculateStats() {
    // Ensure myBids is an array before calling filter
    if (!Array.isArray(this.myBids)) {
      this.myBids = [];
    }
    
    this.stats.totalBids = this.myBids.length;
    this.stats.activeBids = this.myBids.filter(bid => bid.status === 'active').length;
    this.stats.wonBids = this.myBids.filter(bid => bid.status === 'won').length;
    this.stats.totalSpent = this.myBids
      .filter(bid => bid.status === 'won')
      .reduce((total, bid) => total + (bid.bidAmount || 0), 0);
  }

  placeBid(cropId: number, currentBid: number) {
    // Navigate to the bidding marketplace to show the detailed bidding interface
    this.router.navigate(['/bidder/marketplace']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'won': return 'text-blue-600 bg-blue-100';
      case 'lost': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'won': return 'Won';
      case 'lost': return 'Lost';
      default: return 'Unknown';
    }
  }
}
