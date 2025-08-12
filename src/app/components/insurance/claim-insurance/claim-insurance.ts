import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { InsuranceService } from '../../../services/insurance';
import { User } from '../../../models/user.model';
import { InsuranceClaim, InsurancePolicy } from '../../../models/insurance.model';

@Component({
  selector: 'app-claim-insurance',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './claim-insurance.html',
  styleUrl: './claim-insurance.css'
})
export class ClaimInsuranceComponent implements OnInit {
  currentUser: User | null = null;
  claimForm: FormGroup;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  userPolicies: InsurancePolicy[] = [];
  today: string = new Date().toISOString().split('T')[0];

  causeOfLossOptions = [
    'Drought',
    'Flood',
    'Cyclone',
    'Hailstorm',
    'Pest Attack',
    'Disease',
    'Fire',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private insuranceService: InsuranceService,
    private router: Router
  ) {
    this.claimForm = this.fb.group({
      policyNumber: ['', [Validators.required]],
      sumInsured: ['', [Validators.required, Validators.min(1000)]],
      causeOfLoss: ['', [Validators.required]],
      dateOfLoss: ['', [Validators.required]],
      supportingDocuments: ['']
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.userType !== 'FARMER') {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserPolicies();
    this.setDefaultValues();
  }

  loadUserPolicies() {
    this.insuranceService.getUserPolicies(this.currentUser!.id).subscribe({
      next: (policies) => {
        this.userPolicies = policies;
      },
      error: (error) => {
        console.error('Error loading policies:', error);
      }
    });
  }

  setDefaultValues() {
    // No default values needed for the simplified form
  }

  onPolicySelect(policyNumber: string) {
    const selectedPolicy = this.userPolicies.find(p => p.policyNumber === policyNumber);
    if (selectedPolicy) {
      this.claimForm.patchValue({
        sumInsured: selectedPolicy.sumInsured
      });
    }
  }

  onSubmit() {
    if (this.isLoading || this.claimForm.invalid) return;

    this.isLoading = true;
    const formValue = this.claimForm.value;

    const insuranceClaim: InsuranceClaim = {
      id: 0, // Will be set by service
      farmerId: this.currentUser!.id,
      policyNumber: formValue.policyNumber,
      policyId: 0, // Will be set by service
      farmerName: this.currentUser!.fullName,
      causeOfLoss: formValue.causeOfLoss,
      dateOfLoss: new Date(formValue.dateOfLoss),
      supportingDocuments: formValue.supportingDocuments ? [formValue.supportingDocuments] : [],
      claimAmount: formValue.sumInsured,
      status: 'pending',
      createdAt: new Date()
    };

    this.insuranceService.submitClaim(insuranceClaim).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.showMessage('Insurance claim submitted successfully! It will be reviewed by admin.', 'success');
          this.claimForm.reset();
          this.setDefaultValues();
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting claim:', error);
        this.showMessage('Failed to submit claim. Please try again.', 'error');
      }
    });
  }

  resetForm() {
    this.claimForm.reset();
    this.setDefaultValues();
    this.message = '';
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
}
