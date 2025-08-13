import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { InsurancePolicy, InsuranceClaim, InsuranceCalculation } from '../models/insurance.model';
import { AuthService } from './auth';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  constructor(private authService: AuthService, private http: HttpClient, private configService: ConfigService) { }

  // ==================== INSURANCE APPLICATION ====================

  // Get all insurances for a farmer
  getInsurancesByFarmer(farmerEmail: string): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/farmer/policies?farmerEmail=${farmerEmail}`);
  }

  // Get all insurances for a farmer (by farmer ID)
  getFarmerInsurances(farmerEmail: string): Observable<any> {
    // First get the farmer ID from the current user, then call the backend
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return new Observable(observer => {
        observer.next({ success: false, data: [] });
        observer.complete();
      });
    }
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/farmer/${currentUser.id}/policies`);
  }

  // Get insurance by ID
  getInsuranceById(id: number): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/policy/${id}`);
  }

  // Apply for insurance
  applyForInsurance(application: any): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return new Observable(observer => {
        observer.next({ success: false, message: 'User not logged in' });
        observer.complete();
      });
    }
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/apply?farmerEmail=${currentUser.email}`, application);
  }

  // ==================== INSURANCE CALCULATOR ====================

  // Calculate insurance premium
  calculateInsurance(calculation: any): Observable<any> {
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/calculate`, calculation);
  }

  // Get insurance rates
  getInsuranceRates(): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/rates`);
  }

  // ==================== INSURANCE CLAIMS ====================

  // File a claim
  fileClaim(claim: any): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return new Observable(observer => {
        observer.next({ success: false, message: 'User not logged in' });
        observer.complete();
      });
    }
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/claim?farmerEmail=${currentUser.email}`, claim);
  }

  // Get claims by farmer
  getClaimsByFarmer(farmerEmail: string): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/farmer/claims?farmerEmail=${farmerEmail}`);
  }

  // Get claim by ID
  getClaimById(id: number): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/claim/${id}`);
  }

  // ==================== ADMIN ENDPOINTS ====================

  // Get policies by status
  getPoliciesByStatus(status: string): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/admin/policies?status=${status}`);
  }

  // Approve insurance
  approveInsurance(insuranceId: number): Observable<any> {
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/admin/policy/${insuranceId}/approve`, {});
  }

  // Reject insurance
  rejectInsurance(insuranceId: number, reason: string): Observable<any> {
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/admin/policy/${insuranceId}/reject?reason=${reason}`, {});
  }

  // Get claims by status
  getClaimsByStatus(status: string): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/admin/claims?status=${status}`);
  }

  // Approve claim
  approveClaim(claimId: number, approvedAmount: number): Observable<any> {
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/admin/claim/${claimId}/approve?approvedAmount=${approvedAmount}`, {});
  }

  // Reject claim
  rejectClaim(claimId: number, reason: string): Observable<any> {
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/admin/claim/${claimId}/reject?reason=${reason}`, {});
  }

  // Process claim
  processClaim(claimId: number): Observable<any> {
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/admin/claim/${claimId}/process`, {});
  }

  // ==================== STATISTICS ====================

  // Get insurance statistics
  getInsuranceStats(): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/admin/stats`);
  }

  // Get farmer insurance statistics
  getFarmerInsuranceStats(farmerEmail: string): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/farmer/stats?farmerEmail=${farmerEmail}`);
  }

  // Get claim statistics
  getClaimStats(): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/admin/claim-stats`);
  }

  // ==================== LEGACY METHODS FOR COMPATIBILITY ====================

  // Legacy method for backward compatibility
  getUserPolicies(farmerId: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/farmer/policies?farmerEmail=${currentUser.email}`);
  }

  // Legacy method for backward compatibility
  getPendingClaims(): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/admin/claims?status=pending`);
  }

  // Legacy method for backward compatibility
  submitClaim(claim: InsuranceClaim): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return new Observable(observer => {
        observer.next({ success: false, message: 'User not logged in' });
        observer.complete();
      });
    }
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/claim?farmerEmail=${currentUser.email}`, claim);
  }

  // Legacy method for backward compatibility
  approveClaimLegacy(claimId: number): Observable<any> {
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/admin/claim/${claimId}/approve?approvedAmount=0`, {});
  }

  // Legacy method for backward compatibility
  rejectClaimLegacy(claimId: number, reason: string): Observable<any> {
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/admin/claim/${claimId}/reject?reason=${reason}`, {});
  }

  // Legacy method for backward compatibility
  getClaimStatsLegacy(farmerId: number): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ totalPolicies: 0, totalClaims: 0, approvedClaims: 0, totalInsured: 0 });
    }
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/farmer/stats?farmerEmail=${currentUser.email}`);
  }

  // Legacy method for backward compatibility
  getPremiumRates(): Observable<any> {
    return this.http.get(`${this.configService.getInsuranceApiUrl()}/rates`);
  }

  // Legacy method for backward compatibility
  calculatePremium(calculation: InsuranceCalculation): Observable<any> {
    return this.http.post(`${this.configService.getInsuranceApiUrl()}/calculate`, calculation);
  }
}
