export interface User {
  id: number;
  email: string;
  fullName: string;
  contactNo: string;
  userType: 'ADMIN' | 'FARMER' | 'BIDDER';
  isActive: boolean;
  createdAt: Date;
}

export interface Farmer extends User {
  userType: 'FARMER';
  address: Address;
  landDetails: LandDetails;
  bankDetails: BankDetails;
  documents: Documents;
}

export interface Bidder extends User {
  userType: 'BIDDER';
  address: Address;
  bankDetails: BankDetails;
  documents: Documents;
  traderLicense: string;
}

export interface Admin extends User {
  userType: 'ADMIN';
}

export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface LandDetails {
  area: number;
  address: string;
  pinCode: string;
  soilType: string;
  irrigationType: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  accountHolderName: string;
}

export interface Documents {
  aadhaarNumber: string;
  panNumber: string;
  aadhaarCard: string;
  panCard: string;
  profilePhoto: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  userType: 'FARMER' | 'BIDDER';
  fullName: string;
  email: string;
  contactNo: string;
  password: string;
  confirmPassword: string;
  address: Address;
  bankDetails: BankDetails;
  documents: Documents;
  landDetails?: LandDetails;
  traderLicense?: string;
}

// Re-export models from other files for convenience
export type { Crop, Bid, SellRequest } from './bidding.model';
export type { InsurancePolicy, InsuranceClaim } from './insurance.model';
