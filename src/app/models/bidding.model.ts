export interface Crop {
  id: number;
  cropName: string; // Changed from 'name' to match backend
  cropType: string; // Changed from 'type' to match backend
  variety: string;
  quantity: number;
  unit: 'KG' | 'QUINTAL' | 'TON' | 'BAG';
  basePrice: number;
  currentBid?: number;
  status: 'pending' | 'approved' | 'rejected' | 'sold';
  farmerId: number;
  farmerName: string;
  createdAt: Date;
  soldAt?: Date;
  soldPrice?: number;
  soldTo?: number;
  soldToName?: string;
  soilPhCertificate?: string; // Base64 encoded file data
  fertilizerType?: string;
}

export interface Bid {
  id: number;
  cropId: number;
  bidderId: number;
  bidderName: string;
  bidAmount: number;
  status: 'active' | 'won' | 'lost';
  createdAt: Date;
}

export interface SellRequest {
  cropName: string;
  cropType: string;
  variety: string;
  quantity: number;
  unit: 'KG' | 'QUINTAL' | 'TON' | 'BAG';
  basePrice: number;
  fertilizerType?: string;
  soilPhCertificate?: string; // Base64 encoded file data
}

export interface BiddingStats {
  totalCrops: number;
  activeBids: number;
  totalSold: number;
  totalRevenue: number;
}
