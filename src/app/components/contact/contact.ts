import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactService, ContactForm } from '../../services/contact';

interface FAQ {
  question: string;
  answer: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  contactInfo = [
    {
      icon: '📍',
      title: 'Address',
      details: [
        'Farm-Scheme Headquarters',
        'New Delhi, India',
        '110001'
      ]
    },
    {
      icon: '📞',
      title: 'Phone',
      details: [
        '+91 1800-123-4567',
        '+91 11-2345-6789',
        'Mon-Fri: 9:00 AM - 6:00 PM'
      ]
    },
    {
      icon: '✉️',
      title: 'Email',
      details: [
        'info@farmscheme.com',
        'support@farmscheme.com',
        'admin@farmscheme.com'
      ]
    }
  ];

  faqs: FAQ[] = [
    {
      question: 'How do I register as a farmer?',
      answer: 'Click on the Register button and select "Farmer" as your user type. Fill in the required details including your land documents and bank information.',
      expanded: false
    },
    {
      question: 'What documents are required for registration?',
      answer: 'For farmers: Aadhaar, PAN, Land Certificate. For bidders: Aadhaar, PAN, Trader License. All documents are verified by our admin team.',
      expanded: false
    },
    {
      question: 'How does the bidding process work?',
      answer: 'Farmers list their crops with details. Admin approves quality crops. Bidders place competitive bids. Admin finalizes winning bids and facilitates transactions.',
      expanded: false
    },
    {
      question: 'What is PM Fasal Bima Yojana?',
      answer: 'A government crop insurance scheme with 2% premium for Kharif, 1.5% for Rabi, and 5% for annual crops. Government provides 80% subsidy on premium.',
      expanded: false
    },
    {
      question: 'How do I claim insurance?',
      answer: 'Submit claim with policy number, cause of loss, date of loss, and supporting documents. Admin processes and approves claims after verification.',
      expanded: false
    }
  ];

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(20)]],
      userType: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.showMessage('Please fill all required fields correctly.', 'error');
      return;
    }

    this.isLoading = true;
    const formData: ContactForm = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.email,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
      phone: this.contactForm.value.phone
    };

    this.contactService.submitContact(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.showMessage(response.message, 'success');
          this.contactForm.reset();
        } else {
          this.showMessage(response.message, 'error');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Contact form submission error:', error);
        this.showMessage('Failed to submit contact form. Please try again.', 'error');
      }
    });
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors?.['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors?.['pattern']) {
        return 'Please enter a valid 10-digit phone number';
      }
    }
    return '';
  }
}
