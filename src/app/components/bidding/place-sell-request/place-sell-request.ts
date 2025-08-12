import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { BiddingService } from '../../../services/bidding';
import { User } from '../../../models/user.model';
import { SellRequest } from '../../../models/bidding.model';

@Component({
  selector: 'app-place-sell-request',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './place-sell-request.html',
  styleUrl: './place-sell-request.css'
})
export class PlaceSellRequestComponent implements OnInit {
  currentUser: User | null = null;
  sellRequestForm: FormGroup;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  selectedFile: File | null = null;
  fileError = '';
  isDragOver = false;

  cropTypes = ['Wheat', 'Rice', 'Corn', 'Soybeans', 'Cotton', 'Sugarcane', 'Pulses', 'Vegetables', 'Fruits'];
  units = ['KG', 'QUINTAL', 'TON', 'BAG'];
  fertilizerTypes = ['Organic', 'Chemical', 'Mixed', 'None'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private biddingService: BiddingService,
    private router: Router
  ) {
    this.sellRequestForm = this.fb.group({
      cropName: ['', [Validators.required, Validators.minLength(2)]],
      cropType: ['', [Validators.required]],
      variety: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(0.1)]],
      unit: ['QUINTAL', [Validators.required]],
      basePrice: ['', [Validators.required, Validators.min(1)]],
      fertilizerType: ['']
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.userType !== 'FARMER') {
      this.router.navigate(['/login']);
      return;
    }
  }

  async onSubmit() {
    if (this.sellRequestForm.invalid) {
      this.markFormGroupTouched();
      this.showMessage('❌ Please fill in all required fields correctly.', 'error');
      return;
    }

    this.isLoading = true;
    this.showMessage('⏳ Submitting your sell request... Please wait.', 'success');

    const formValue = this.sellRequestForm.value;
    let soilPhCertificateData: string | undefined = undefined;

    if (this.selectedFile) {
      try {
        soilPhCertificateData = await this.convertFileToBase64(this.selectedFile);
      } catch (error) {
        this.isLoading = false;
        this.showMessage('❌ Error processing file. Please try again.', 'error');
        return;
      }
    }

    const sellRequest: SellRequest = {
      cropName: formValue.cropName,
      cropType: formValue.cropType,
      variety: formValue.variety,
      quantity: formValue.quantity,
      unit: formValue.unit,
      basePrice: formValue.basePrice,
      fertilizerType: formValue.fertilizerType || undefined,
      soilPhCertificate: soilPhCertificateData
    };

    this.biddingService.placeSellRequest(sellRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.showMessage('✅ Crop added successfully! Your sell request has been submitted and is pending admin approval. You will be notified once it\'s approved for bidding.', 'success');
          this.resetForm();
        } else {
          this.showMessage('❌ ' + response.message, 'error');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error submitting sell request:', error);
        
        // Provide more specific error messages based on the error type
        let errorMessage = 'Failed to submit sell request. Please try again.';
        
        if (error.status === 400) {
          errorMessage = '❌ Invalid data provided. Please check your form and try again.';
        } else if (error.status === 401) {
          errorMessage = '❌ You are not authorized. Please log in again.';
        } else if (error.status === 500) {
          errorMessage = '❌ Server error. Please try again later or contact support.';
        } else if (error.error && error.error.message) {
          errorMessage = '❌ ' + error.error.message;
        }
        
        this.showMessage(errorMessage, 'error');
      }
    });
  }

  resetForm() {
    this.sellRequestForm.reset();
    this.sellRequestForm.patchValue({ unit: 'QUINTAL' });
    this.selectedFile = null;
    this.fileError = '';
    this.message = '';
    this.showMessage('🫡 Your sell request has been submitted and is pending admin approval. You will be notified once it\'s approved for bidding.', 'success');
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  private markFormGroupTouched() {
    Object.keys(this.sellRequestForm.controls).forEach(key => {
      const control = this.sellRequestForm.get(key);
      control?.markAsTouched();
    });
  }

  calculateTotalValue(): number {
    const quantity = this.sellRequestForm.get('quantity')?.value || 0;
    const basePrice = this.sellRequestForm.get('basePrice')?.value || 0;
    return quantity * basePrice;
  }

  // File handling methods
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.validateAndSetFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  private validateAndSetFile(file: File) {
    this.fileError = '';
    
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.fileError = 'Please select a valid file type (PDF, JPG, PNG)';
      return;
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.fileError = 'File size must be less than 5MB';
      return;
    }
    
    this.selectedFile = file;
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.fileError = '';
  }

  private async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
}
