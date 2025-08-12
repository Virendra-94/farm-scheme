import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { BiddingService } from '../../../services/bidding';
import { User } from '../../../models/user.model';
import { Crop, Bid } from '../../../models/bidding.model';

@Component({
  selector: 'app-bidding-marketplace',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './bidding-marketplace.html',
  styleUrl: './bidding-marketplace.css'
})
export class BiddingMarketplaceComponent implements OnInit {
  currentUser: User | null = null;
  availableCrops: Crop[] = [];
  filteredCrops: Crop[] = [];
  isLoading = false;
  searchTerm = '';
  selectedCropType = '';
  selectedStatus = '';
  bidAmount = 0;
  selectedCrop: Crop | null = null;
  showBidHistory = false;
  cropBidHistory: Bid[] = [];

  cropTypes = ['Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton', 'Sugarcane', 'Pulses', 'Vegetables', 'Fruits'];
  statuses = ['pending', 'approved', 'sold'];

  constructor(
    private authService: AuthService,
    private biddingService: BiddingService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('BiddingMarketplaceComponent ngOnInit called');
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current user:', this.currentUser);
    if (!this.currentUser) {
      console.log('No current user, navigating to login');
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadMarketplaceData();
  }

  loadMarketplaceData() {
    this.isLoading = true;
    
    this.biddingService.getAvailableCrops().subscribe({
      next: (response) => {
        if (response && response.success && response.data) {
          this.availableCrops = response.data;
          console.log('Available crops set:', this.availableCrops);
          this.filterCrops(); // Apply filters after setting data
          console.log('Filtered crops:', this.filteredCrops);
        } else {
          this.availableCrops = [];
          this.filteredCrops = [];
          console.warn('No crops data received:', response);
        }
        this.isLoading = false;
        console.log('Loading state set to false');
      },
      error: (error) => {
        console.error('Error loading marketplace data:', error);
        this.availableCrops = [];
        this.filteredCrops = [];
        this.isLoading = false;
      }
    });
  }

  refreshMarketplace() {
    this.loadMarketplaceData();
  }

  filterCrops() {
    this.filteredCrops = this.availableCrops.filter(crop => {
      const matchesSearch = !this.searchTerm || 
        crop.cropName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        crop.farmerName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesType = !this.selectedCropType || crop.cropType === this.selectedCropType;
      const matchesStatus = !this.selectedStatus || crop.status === this.selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  selectCropForBidding(crop: Crop) {
    this.selectedCrop = crop;
    this.bidAmount = (crop.currentBid || crop.basePrice) + 100; // Default increment
    this.loadBidHistory(crop.id);
  }

  loadBidHistory(cropId: number) {
    this.biddingService.getBidHistory(cropId).subscribe({
      next: (response) => {
        if (response && response.success && response.data) {
          this.cropBidHistory = response.data;
        } else {
          this.cropBidHistory = [];
        }
        this.showBidHistory = true;
      },
      error: (error) => {
        console.error('Error loading bid history:', error);
        this.cropBidHistory = [];
        this.showBidHistory = true;
      }
    });
  }

  placeBid() {
    if (!this.selectedCrop || !this.currentUser) return;

    if (this.bidAmount <= (this.selectedCrop.currentBid || this.selectedCrop.basePrice)) {
      alert('Bid amount must be higher than the current bid!');
      return;
    }

    this.biddingService.placeBid({
      cropId: this.selectedCrop.id,
      bidAmount: this.bidAmount
    }).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Bid placed successfully!');
          this.selectedCrop = null;
          this.bidAmount = 0;
          this.showBidHistory = false;
          this.loadMarketplaceData(); // Refresh data
        } else {
          alert('Failed to place bid: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error placing bid:', error);
        alert('Error placing bid. Please try again.');
      }
    });
  }

  cancelBidding() {
    this.selectedCrop = null;
    this.bidAmount = 0;
    this.showBidHistory = false;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'sold': return 'Sold';
      default: return status;
    }
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString()}`;
  }

  formatDate(date: Date | string): string {
    try {
      return new Date(date).toLocaleDateString('en-IN');
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid Date';
    }
  }

  getCurrentBidText(crop: Crop): string {
    if (crop.currentBid) {
      return `Current Bid: ${this.formatPrice(crop.currentBid)}`;
    }
    return `Base Price: ${this.formatPrice(crop.basePrice)}`;
  }

  getBidCount(crop: Crop): number {
    // For now, return 0 since we don't have bid history for all crops
    // This should be updated to fetch bid count from the backend
    return 0;
  }

  isHighestBidder(crop: Crop): boolean {
    if (!this.currentUser || !crop.currentBid) return false;
    const highestBid = this.cropBidHistory
      .filter(bid => bid.cropId === crop.id)
      .sort((a, b) => b.bidAmount - a.bidAmount)[0];
    return highestBid?.bidderId === this.currentUser.id;
  }
}
