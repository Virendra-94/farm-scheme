import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { BiddingService } from '../../../services/bidding';
import { InsuranceService } from '../../../services/insurance';
import { UserManagementService } from '../../../services/user-management';
import { ContactService } from '../../../services/contact';
import { User } from '../../../models/user.model';
import { Crop, Bid } from '../../../models/bidding.model';
import { InsuranceClaim } from '../../../models/insurance.model';
import { Subject, takeUntil, timeout, catchError, of } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  farmers: any[] = [];
  bidders: any[] = [];
  pendingCrops: any[] = [];
  pendingClaims: any[] = [];
  pendingContacts: any[] = [];
  isLoading = false;
  stats = {
    totalFarmers: 0,
    totalBidders: 0,
    totalUsers: 0,
    pendingApprovals: 0,
    pendingClaims: 0,
    pendingContacts: 0,
    totalCrops: 0,
    totalInsurances: 0
  };

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private biddingService: BiddingService,
    private insuranceService: InsuranceService,
    private userManagementService: UserManagementService,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.userType !== 'ADMIN') {
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
    console.log('=== Loading Dashboard Data ===');
    this.isLoading = true;
    
    // Load all users for stats
    this.userManagementService.getAllUsers().pipe(
      takeUntil(this.destroy$),
      timeout(10000), // 10 second timeout
      catchError(error => {
        console.error('Error loading users:', error);
        return of({ success: false, data: [] });
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          const users = response.data;
          
          // Calculate total stats (including all users for the summary cards)
          const allFarmers = users.filter((user: any) => user.userType === 'FARMER');
          const allBidders = users.filter((user: any) => user.userType === 'BIDDER');
          
          this.stats.totalFarmers = allFarmers.length;
          this.stats.totalBidders = allBidders.length;
          this.stats.totalUsers = users.length;
          console.log('Loaded users - Total Farmers:', allFarmers.length, 'Total Bidders:', allBidders.length);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });

    // Load pending users specifically
    this.loadPendingUsers();

    // Load pending crops for approval
    this.biddingService.getCropsByStatus('pending').pipe(
      takeUntil(this.destroy$),
      timeout(10000),
      catchError(error => {
        console.error('Error loading pending crops:', error);
        return of({ success: false, data: [] });
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Pending crops response:', response);
        if (response.success) {
          this.pendingCrops = response.data;
          this.stats.pendingApprovals = this.pendingCrops.length;
          console.log('Loaded pending crops:', this.pendingCrops.length);
        } else {
          this.pendingCrops = [];
          this.stats.pendingApprovals = 0;
        }
      },
      error: (error: any) => {
        console.error('Error loading pending crops:', error);
        this.pendingCrops = [];
        this.stats.pendingApprovals = 0;
      }
    });

    // Load pending insurance claims
    this.insuranceService.getClaimsByStatus('pending').pipe(
      takeUntil(this.destroy$),
      timeout(10000),
      catchError(error => {
        console.error('Error loading pending claims:', error);
        return of({ success: false, data: [] });
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Pending claims response:', response);
        if (response.success) {
          this.pendingClaims = response.data;
          this.stats.pendingClaims = this.pendingClaims.length;
          console.log('Loaded pending claims:', this.pendingClaims.length);
        } else {
          this.pendingClaims = [];
          this.stats.pendingClaims = 0;
        }
      },
      error: (error: any) => {
        console.error('Error loading pending claims:', error);
        this.pendingClaims = [];
        this.stats.pendingClaims = 0;
      }
    });

    // Load pending contacts
    this.contactService.getContactsByStatus('pending').pipe(
      takeUntil(this.destroy$),
      timeout(10000),
      catchError(error => {
        console.error('Error loading pending contacts:', error);
        return of({ success: false, data: [] });
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Pending contacts response:', response);
        if (response.success) {
          this.pendingContacts = response.data;
          this.stats.pendingContacts = this.pendingContacts.length;
          console.log('Loaded pending contacts:', this.pendingContacts.length);
        } else {
          this.pendingContacts = [];
          this.stats.pendingContacts = 0;
        }
      },
      error: (error: any) => {
        console.error('Error loading pending contacts:', error);
        this.pendingContacts = [];
        this.stats.pendingContacts = 0;
      }
    });
  }

  loadPendingUsers() {
    this.userManagementService.getUsersByStatus('PENDING').pipe(
      takeUntil(this.destroy$),
      timeout(10000),
      catchError(error => {
        console.error('Error loading pending users:', error);
        return of({ success: false, data: [] });
      })
    ).subscribe({
      next: (response) => {
        console.log('Pending users response:', response);
        if (response.success) {
          this.farmers = response.data.filter((user: any) => user.userType === 'FARMER');
          this.bidders = response.data.filter((user: any) => user.userType === 'BIDDER');
          console.log('Loaded pending users - Pending Farmers:', this.farmers.length, 'Pending Bidders:', this.bidders.length);
          console.log('Pending farmers:', this.farmers);
          console.log('Pending bidders:', this.bidders);
        } else {
          this.farmers = [];
          this.bidders = [];
          console.log('No pending users found.');
        }
      },
      error: (error) => {
        console.error('Error loading pending users:', error);
        this.farmers = [];
        this.bidders = [];
      }
    });
  }

  // Debug method to check current data
  debugCurrentData() {
    console.log('=== DEBUG: Current Dashboard Data ===');
    console.log('Farmers:', this.farmers);
    console.log('Bidders:', this.bidders);
    console.log('Pending Crops:', this.pendingCrops);
    console.log('Pending Claims:', this.pendingClaims);
    console.log('Pending Contacts:', this.pendingContacts);
    console.log('Stats:', this.stats);
  }

  approveUser(userId: number) {
    this.userManagementService.updateUserStatus(userId, 'ACTIVE').pipe(
      takeUntil(this.destroy$),
      timeout(10000),
      catchError(error => {
        console.error('Error approving user:', error);
        return of({ success: false, message: 'Failed to approve user. Please try again.' });
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          // Immediately remove from pending lists
          this.farmers = this.farmers.filter(user => user.id !== userId);
          this.bidders = this.bidders.filter(user => user.id !== userId);
          
          alert('User approved successfully!');
          // Reload pending users to ensure consistency
          this.loadPendingUsers();
        } else {
          alert('Failed to approve user: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error approving user:', error);
        alert('Error approving user. Please try again.');
      }
    });
  }

  rejectUser(userId: number) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.userManagementService.updateUserStatus(userId, 'SUSPENDED').pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError(error => {
          console.error('Error suspending user:', error);
          return of({ success: false, message: 'Failed to suspend user. Please try again.' });
        })
      ).subscribe({
        next: (response) => {
          if (response.success) {
            // Immediately remove from pending lists
            this.farmers = this.farmers.filter(user => user.id !== userId);
            this.bidders = this.bidders.filter(user => user.id !== userId);
            
            alert('User suspended successfully!');
            // Reload pending users to ensure consistency
            this.loadPendingUsers();
          } else {
            alert('Failed to suspend user: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error suspending user:', error);
          alert('Error suspending user. Please try again.');
        }
      });
    }
  }

  // Crop approval methods
  approveCrop(cropId: number) {
    this.biddingService.approveCrop(cropId).pipe(
      takeUntil(this.destroy$),
      timeout(10000),
      catchError(error => {
        console.error('Error approving crop:', error);
        return of({ success: false, message: 'Failed to approve crop. Please try again.' });
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          // Immediately remove from pending list
          this.pendingCrops = this.pendingCrops.filter(crop => crop.id !== cropId);
          this.stats.pendingApprovals = this.pendingCrops.length;
          alert('Crop approved successfully!');
          // Refresh all data to ensure consistency
          this.loadDashboardData();
        } else {
          alert('Failed to approve crop: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error approving crop:', error);
        alert('Error approving crop. Please try again.');
      }
    });
  }

  rejectCrop(cropId: number) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.biddingService.rejectCrop(cropId, reason).pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError(error => {
          console.error('Error rejecting crop:', error);
          return of({ success: false, message: 'Failed to reject crop. Please try again.' });
        })
      ).subscribe({
        next: (response) => {
          if (response.success) {
            // Immediately remove from pending list
            this.pendingCrops = this.pendingCrops.filter(crop => crop.id !== cropId);
            this.stats.pendingApprovals = this.pendingCrops.length;
            alert('Crop rejected successfully!');
            // Refresh all data to ensure consistency
            this.loadDashboardData();
          } else {
            alert('Failed to reject crop: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error rejecting crop:', error);
          alert('Error rejecting crop. Please try again.');
        }
      });
    }
  }

  // Insurance claim approval methods
  approveClaim(claimId: number) {
    const approvedAmount = prompt('Please enter the approved amount:');
    if (approvedAmount && !isNaN(Number(approvedAmount))) {
      this.insuranceService.approveClaim(claimId, Number(approvedAmount)).pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError(error => {
          console.error('Error approving claim:', error);
          return of({ success: false, message: 'Failed to approve claim. Please try again.' });
        })
      ).subscribe({
        next: (response) => {
          if (response.success) {
            // Immediately remove from pending list
            this.pendingClaims = this.pendingClaims.filter(claim => claim.id !== claimId);
            this.stats.pendingClaims = this.pendingClaims.length;
            alert('Claim approved successfully!');
            // Refresh all data to ensure consistency
            this.loadDashboardData();
          } else {
            alert('Failed to approve claim: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error approving claim:', error);
          alert('Error approving claim. Please try again.');
        }
      });
    }
  }

  rejectClaim(claimId: number) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.insuranceService.rejectClaim(claimId, reason).pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError(error => {
          console.error('Error rejecting claim:', error);
          return of({ success: false, message: 'Failed to reject claim. Please try again.' });
        })
      ).subscribe({
        next: (response) => {
          if (response.success) {
            // Immediately remove from pending list
            this.pendingClaims = this.pendingClaims.filter(claim => claim.id !== claimId);
            this.stats.pendingClaims = this.pendingClaims.length;
            alert('Claim rejected successfully!');
            // Refresh all data to ensure consistency
            this.loadDashboardData();
          } else {
            alert('Failed to reject claim: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error rejecting claim:', error);
          alert('Error rejecting claim. Please try again.');
        }
      });
    }
  }

  // Contact response methods
  respondToContact(contactId: number) {
    const response = prompt('Please enter your response:');
    if (response) {
      this.contactService.respondToContact(contactId, response).pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        catchError(error => {
          console.error('Error responding to contact:', error);
          return of({ success: false, message: 'Failed to respond to contact. Please try again.' });
        })
      ).subscribe({
        next: (response) => {
          if (response.success) {
            // Immediately remove from pending list
            this.pendingContacts = this.pendingContacts.filter(contact => contact.id !== contactId);
            this.stats.pendingContacts = this.pendingContacts.length;
            alert('Response sent successfully!');
            // Refresh all data to ensure consistency
            this.loadDashboardData();
          } else {
            alert('Failed to send response: ' + response.message);
          }
        },
        error: (error) => {
          console.error('Error responding to contact:', error);
          alert('Error sending response. Please try again.');
        }
      });
    }
  }

  closeContact(contactId: number) {
    this.contactService.closeContact(contactId).pipe(
      takeUntil(this.destroy$),
      timeout(10000),
      catchError(error => {
        console.error('Error closing contact:', error);
        return of({ success: false, message: 'Failed to close contact. Please try again.' });
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          // Immediately remove from pending list
          this.pendingContacts = this.pendingContacts.filter(contact => contact.id !== contactId);
          this.stats.pendingContacts = this.pendingContacts.length;
          alert('Contact closed successfully!');
          // Refresh all data to ensure consistency
          this.loadDashboardData();
        } else {
          alert('Failed to close contact: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Error closing contact:', error);
        alert('Error closing contact. Please try again.');
      }
    });
  }

  logout() {
    this.authService.logout();
    // Navigate to home page without forcing reload
    this.router.navigate(['/']);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  }
}
