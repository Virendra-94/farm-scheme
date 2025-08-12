import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { BiddingService } from '../../../services/bidding';
import { User } from '../../../models/user.model';
import { Crop } from '../../../models/bidding.model';

@Component({
  selector: 'app-sold-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sold-history.html',
  styleUrl: './sold-history.css'
})
export class SoldHistoryComponent implements OnInit {
  currentUser: User | null = null;
  soldCrops: Crop[] = [];
  isLoading = false;
  stats = {
    totalSold: 0,
    totalRevenue: 0,
    averagePrice: 0,
    totalQuantity: 0
  };

  constructor(
    private authService: AuthService,
    private biddingService: BiddingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.userType !== 'FARMER') {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadSoldHistory();
  }

  loadSoldHistory() {
    this.isLoading = true;
    
    this.biddingService.getFarmerSoldHistory(this.currentUser!.email).subscribe({
      next: (crops) => {
        this.soldCrops = crops;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sold history:', error);
        this.isLoading = false;
      }
    });
  }

  calculateStats() {
    this.stats.totalSold = this.soldCrops.length;
    this.stats.totalRevenue = this.soldCrops.reduce((total, crop) => total + (crop.soldPrice || 0), 0);
    this.stats.totalQuantity = this.soldCrops.reduce((total, crop) => total + crop.quantity, 0);
    this.stats.averagePrice = this.stats.totalSold > 0 ? this.stats.totalRevenue / this.stats.totalSold : 0;
  }

  formatPrice(price: number): string {
    return '₹' + price.toLocaleString();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getProfitMargin(crop: Crop): number {
    if (!crop.soldPrice || !crop.basePrice) return 0;
    return ((crop.soldPrice - crop.basePrice) / crop.basePrice) * 100;
  }

  getProfitMarginColor(margin: number): string {
    if (margin > 20) return 'text-green-600';
    if (margin > 10) return 'text-yellow-600';
    if (margin > 0) return 'text-blue-600';
    return 'text-red-600';
  }
}
