import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private getApiUrl(): string {
    // Check if we're in production (deployed on Render)
    if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
      // For production, use ngrok tunnel if available
      // You need to run: ngrok http 8089
      // Then replace this URL with your ngrok URL
      const ngrokUrl = localStorage.getItem('ngrokUrl');
      if (ngrokUrl) {
        return `${ngrokUrl}/api`;
      }
      
      // Fallback to HTTP (may be blocked by browser)
      return 'http://localhost:8089/api';
    } else {
      // For development, use HTTP localhost
      return 'http://localhost:8089/api';
    }
  }

  getAuthApiUrl(): string {
    return `${this.getApiUrl()}/auth`;
  }

  getBiddingApiUrl(): string {
    return `${this.getApiUrl()}/bidding`;
  }

  getInsuranceApiUrl(): string {
    return `${this.getApiUrl()}/insurance`;
  }

  getUserApiUrl(): string {
    return `${this.getApiUrl()}/user`;
  }

  getContactApiUrl(): string {
    return `${this.getApiUrl()}/contact`;
  }
}
