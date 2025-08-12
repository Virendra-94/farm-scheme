import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { InsuranceService } from '../../../services/insurance';
import { User } from '../../../models/user.model';
import { InsuranceCalculation } from '../../../models/insurance.model';

@Component({
  selector: 'app-insurance-calculator',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './insurance-calculator.html',
  styleUrl: './insurance-calculator.css'
})
export class InsuranceCalculatorComponent implements OnInit {
  currentUser: User | null = null;
  calculatorForm: FormGroup;
  isLoading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  showCalculation = false;
  calculationResult: any = null;

  seasons = [
    { value: 'kharif', label: 'Kharif (Monsoon Season)', rate: 2.0 },
    { value: 'rabi', label: 'Rabi (Winter Season)', rate: 1.5 },
    { value: 'annual', label: 'Annual (Commercial/Horticultural)', rate: 5.0 }
  ];

  cropTypes = [
    { value: 'Cereal', label: 'Cereal Crops (Rice, Wheat, Maize)' },
    { value: 'Pulses', label: 'Pulses (Lentils, Chickpeas)' },
    { value: 'Oilseeds', label: 'Oilseeds (Mustard, Sunflower)' },
    { value: 'Vegetables', label: 'Vegetables' },
    { value: 'Fruits', label: 'Fruits' },
    { value: 'Commercial', label: 'Commercial Crops (Sugarcane, Cotton)' }
  ];

  zoneTypes = [
    { value: 'zone1', label: 'Zone I (Low Risk)', factor: 1.0 },
    { value: 'zone2', label: 'Zone II (Medium Risk)', factor: 1.2 },
    { value: 'zone3', label: 'Zone III (High Risk)', factor: 1.5 }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private insuranceService: InsuranceService,
    private router: Router
  ) {
    this.calculatorForm = this.fb.group({
      season: ['', [Validators.required]],
      cropType: ['', [Validators.required]],
      area: ['', [Validators.required, Validators.min(0.1), Validators.max(100)]],
      zoneType: ['', [Validators.required]],
      sumInsuredPerHectare: ['', [Validators.required, Validators.min(1000), Validators.max(100000)]]
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.userType !== 'FARMER') {
      this.router.navigate(['/login']);
      return;
    }
  }

  calculatePremium() {
    if (this.calculatorForm.invalid) {
      this.showMessage('Please fill all required fields correctly.', 'error');
      return;
    }

    this.isLoading = true;
    const formValue = this.calculatorForm.value;
    
    // Calculate total sum insured
    const totalSumInsured = formValue.area * formValue.sumInsuredPerHectare;
    
    // Get base premium rate based on season and crop type
    let baseRate = this.getBasePremiumRate(formValue.season, formValue.cropType);
    
    // Apply zone factor
    const zoneFactor = this.getZoneFactor(formValue.zoneType);
    const adjustedRate = baseRate * zoneFactor;
    
    // Calculate premium amounts
    const totalPremium = (totalSumInsured * adjustedRate) / 100;
    const governmentShare = totalPremium * 0.8; // 80% government share
    const farmerShare = totalPremium * 0.2; // 20% farmer share

    this.calculationResult = {
      season: formValue.season,
      cropType: formValue.cropType,
      area: formValue.area,
      zoneType: formValue.zoneType,
      sumInsuredPerHectare: formValue.sumInsuredPerHectare,
      totalSumInsured: totalSumInsured,
      baseRate: baseRate,
      zoneFactor: zoneFactor,
      adjustedRate: adjustedRate,
      totalPremium: totalPremium,
      governmentShare: governmentShare,
      farmerShare: farmerShare,
      calculationDate: new Date()
    };

    this.showCalculation = true;
    this.isLoading = false;
    this.showMessage('Premium calculated successfully!', 'success');
  }

  getBasePremiumRate(season: string, cropType: string): number {
    if (season === 'kharif') {
      return 2.0;
    } else if (season === 'rabi') {
      return 1.5;
    } else if (season === 'annual') {
      if (cropType === 'Vegetables' || cropType === 'Fruits') {
        return 5.0;
      } else {
        return 3.0;
      }
    }
    return 2.0; // Default rate
  }

  getZoneFactor(zoneType: string): number {
    const zone = this.zoneTypes.find(z => z.value === zoneType);
    return zone ? zone.factor : 1.0;
  }

  applyForInsurance() {
    if (!this.calculationResult) {
      this.showMessage('Please calculate premium first.', 'error');
      return;
    }

    // Navigate to insurance application with pre-filled data
    this.router.navigate(['/insurance/application'], {
      queryParams: {
        season: this.calculationResult.season,
        cropType: this.calculationResult.cropType,
        area: this.calculationResult.area,
        zoneType: this.calculationResult.zoneType,
        sumInsured: this.calculationResult.totalSumInsured,
        premiumAmount: this.calculationResult.farmerShare
      }
    });
  }

  resetForm() {
    this.calculatorForm.reset();
    this.showCalculation = false;
    this.calculationResult = null;
    this.message = '';
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  getSeasonLabel(value: string): string {
    const season = this.seasons.find(s => s.value === value);
    return season ? season.label : value;
  }

  getCropTypeLabel(value: string): string {
    const cropType = this.cropTypes.find(c => c.value === value);
    return cropType ? cropType.label : value;
  }

  getZoneTypeLabel(value: string): string {
    const zoneType = this.zoneTypes.find(z => z.value === value);
    return zoneType ? zoneType.label : value;
  }
}
