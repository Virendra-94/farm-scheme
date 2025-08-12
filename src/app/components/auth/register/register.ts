import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { User, RegisterRequest } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  userType: 'farmer' | 'bidder' | null = null;
  farmerForm: FormGroup;
  bidderForm: FormGroup;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.farmerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      contactNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pinCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      area: ['', [Validators.required, Validators.min(0.1)]],
      landAddress: ['', [Validators.required]],
      landPinCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      accountNo: ['', [Validators.required]],
      ifscCode: ['', [Validators.required]],
      aadhaar: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      pan: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      certificate: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.bidderForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      contactNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pinCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      accountNo: ['', [Validators.required]],
      ifscCode: ['', [Validators.required]],
      aadhaar: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
      pan: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      traderLicense: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword && confirmPassword.errors) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  selectUserType(type: 'farmer' | 'bidder') {
    this.userType = type;
    this.message = '';
  }

  onSubmit() {
    if (this.isLoading) return;

    const form = this.userType === 'farmer' ? this.farmerForm : this.bidderForm;
    
    if (form.invalid) {
      this.showMessage('Please fill all required fields correctly.', 'error');
      return;
    }

    this.isLoading = true;
    const formValue = form.value;

    const registerData: RegisterRequest = {
      userType: this.userType!.toUpperCase() as 'FARMER' | 'BIDDER',
      fullName: formValue.fullName,
      email: formValue.email,
      contactNo: formValue.contactNo,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      address: {
        streetAddress: formValue.addressLine1 + (formValue.addressLine2 ? ', ' + formValue.addressLine2 : ''),
        city: formValue.city,
        state: formValue.state,
        pinCode: formValue.pinCode,
        country: 'India' // Default country
      },
      bankDetails: {
        bankName: 'Default Bank', // You might want to add this field to the form
        accountNumber: formValue.accountNo,
        ifscCode: formValue.ifscCode,
        branchName: 'Default Branch', // You might want to add this field to the form
        accountHolderName: formValue.fullName
      },
      documents: {
        aadhaarNumber: formValue.aadhaar,
        panNumber: formValue.pan,
        aadhaarCard: '', // Base64 encoded - you might want to add file upload
        panCard: '', // Base64 encoded - you might want to add file upload
        profilePhoto: '' // Base64 encoded - you might want to add file upload
      },
      landDetails: this.userType === 'farmer' ? {
        area: parseFloat(formValue.area),
        address: formValue.landAddress,
        pinCode: formValue.landPinCode,
        soilType: 'Alluvial', // You might want to add this field to the form
        irrigationType: 'IRRIGATED' // You might want to add this field to the form
      } : undefined,
      traderLicense: this.userType === 'bidder' ? formValue.traderLicense : undefined
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.showMessage('Registration successful! Redirecting to dashboard...', 'success');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showMessage('Registration failed. Please try again.', 'error');
      }
    });
  }

  resetForm() {
    if (this.userType === 'farmer') {
      this.farmerForm.reset();
    } else if (this.userType === 'bidder') {
      this.bidderForm.reset();
    }
    this.message = '';
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
