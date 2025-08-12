export interface InsurancePolicy {
  id: number;
  policyNumber: string;
  farmerId: number;
  farmerName: string;
  season: 'kharif' | 'rabi' | 'annual';
  year: number;
  cropName: string;
  cropType: string;
  area: number;
  zoneType: 'zone1' | 'zone2' | 'zone3';
  sumInsured: number;
  premiumAmount: number;
  premiumRate: number;
  status: 'active' | 'expired' | 'claimed';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface InsuranceClaim {
  id: number;
  policyNumber: string;
  policyId: number;
  farmerId: number;
  farmerName: string;
  causeOfLoss: string;
  dateOfLoss: Date;
  supportingDocuments: string[];
  claimAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  adminRemarks?: string;
  createdAt: Date;
  processedAt?: Date;
}

export interface InsuranceCalculator {
  season: 'kharif' | 'rabi' | 'annual';
  cropType: string;
  area: number;
  zoneType: 'zone1' | 'zone2' | 'zone3';
}

export interface InsuranceCalculation {
  season: 'kharif' | 'rabi' | 'annual';
  cropType: string;
  sumInsured: number;
  premiumRate: number;
  premiumAmount: number;
  governmentShare: number;
  farmerShare: number;
}

export interface CropType {
  name: string;
  type: string;
  baseRate: number;
  season: 'kharif' | 'rabi' | 'annual';
}

export interface ZoneType {
  name: string;
  riskFactor: number;
  description: string;
}
