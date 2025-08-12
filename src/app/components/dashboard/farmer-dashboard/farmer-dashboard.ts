import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { BiddingService } from '../../../services/bidding';
import { InsuranceService } from '../../../services/insurance';
import { User } from '../../../models/user.model';
import { BiddingStats } from '../../../models/bidding.model';
import { Subject, takeUntil, timeout, catchError, of } from 'rxjs';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './farmer-dashboard.html',
  styleUrl: './farmer-dashboard.css'
})
export class FarmerDashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  lastLogin = new Date();
  isLoading = false;
  
  stats: BiddingStats = {
    totalCrops: 0,
    activeBids: 0,
    totalSold: 0,
    totalRevenue: 0
  };

  recentActivities: any[] = [];
  myCrops: any[] = [];
  myInsurances: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private biddingService: BiddingService,
    private insuranceService: InsuranceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.userType !== 'FARMER') {
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
    
    // Load farmer's crops
    this.biddingService.getFarmerSoldHistory(this.currentUser!.email).pipe(
      takeUntil(this.destroy$),
      timeout(10000),
      catchError(error => {
        console.error('Error loading farmer crops:', error);
        return of({ success: false, data: [] });
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.myCrops = response.data || [];
          this.calculateStats();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading farmer crops:', error);
        this.myCrops = [];
        this.isLoading = false;
      }
    });

    // Load farmer's insurances
    this.insuranceService.getFarmerInsurances(this.currentUser!.email).pipe(
      takeUntil(this.destroy$),
      timeout(10000),
      catchError(error => {
        console.error('Error loading farmer insurances:', error);
        return of({ success: false, data: [] });
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.myInsurances = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading farmer insurances:', error);
        this.myInsurances = [];
      }
    });

    // Generate recent activities based on real data
    this.generateRecentActivities();
  }

  calculateStats() {
    if (!Array.isArray(this.myCrops)) {
      this.myCrops = [];
    }

    this.stats.totalCrops = this.myCrops.length;
    this.stats.activeBids = this.myCrops.filter(crop => crop.status === 'approved').length;
    this.stats.totalSold = this.myCrops.filter(crop => crop.status === 'sold').length;
    this.stats.totalRevenue = this.myCrops
      .filter(crop => crop.status === 'sold' && crop.soldPrice)
      .reduce((total, crop) => total + (crop.soldPrice || 0), 0);
  }

  generateRecentActivities() {
    this.recentActivities = [];

    // Add crop-related activities
    this.myCrops.forEach(crop => {
      if (crop.createdAt) {
        this.recentActivities.push({
          title: 'Crop Listed for Bidding',
          description: `${crop.cropName} crop has been listed for bidding`,
          time: new Date(crop.createdAt)
        });
      }
      
      if (crop.soldAt) {
        this.recentActivities.push({
          title: 'Crop Sold Successfully',
          description: `${crop.cropName} crop sold for ₹${crop.soldPrice || 0}`,
          time: new Date(crop.soldAt)
        });
      }
    });

    // Add insurance-related activities
    this.myInsurances.forEach(insurance => {
      if (insurance.createdAt) {
        this.recentActivities.push({
          title: 'Insurance Applied',
          description: `Insurance applied for ${insurance.cropName || 'crop'}`,
          time: new Date(insurance.createdAt)
        });
      }
      
      if (insurance.status === 'approved' && insurance.updatedAt) {
        this.recentActivities.push({
          title: 'Insurance Claim Approved',
          description: `Your insurance claim for ${insurance.cropName || 'crop'} has been approved`,
          time: new Date(insurance.updatedAt)
        });
      }
    });

    // Sort by time (most recent first) and take only the latest 4
    this.recentActivities.sort((a, b) => b.time.getTime() - a.time.getTime());
    this.recentActivities = this.recentActivities.slice(0, 4);

    // If no real activities, show a default message
    if (this.recentActivities.length === 0) {
      this.recentActivities = [{
        title: 'Welcome to Farm Scheme',
        description: 'Start by listing your crops for bidding or applying for insurance',
        time: new Date()
      }];
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  viewMarketPrices() {
    alert('Market prices feature coming soon!');
  }

  viewWeather() {
    alert('Weather forecast feature coming soon!');
  }

  contactSupport() {
    this.router.navigate(['/contact']);
  }
}
