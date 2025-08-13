import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status: 'PENDING' | 'RESPONDED' | 'CLOSED';
  adminResponse?: string;
  responseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private http: HttpClient, private configService: ConfigService) { }

  // ==================== PUBLIC ENDPOINTS ====================

  // Submit contact form
  submitContact(contact: ContactForm): Observable<any> {
    return this.http.post(`${this.configService.getContactApiUrl()}/submit`, contact);
  }

  // ==================== ADMIN ENDPOINTS ====================

  // Get all contacts
  getAllContacts(): Observable<any> {
    return this.http.get(`${this.configService.getContactApiUrl()}/admin/all`);
  }

  // Get contacts by status
  getContactsByStatus(status: string): Observable<any> {
    return this.http.get(`${this.configService.getContactApiUrl()}/admin/status/${status}`);
  }

  // Get contact by ID
  getContactById(contactId: number): Observable<any> {
    return this.http.get(`${this.configService.getContactApiUrl()}/admin/${contactId}`);
  }

  // Respond to contact
  respondToContact(contactId: number, response: string): Observable<any> {
    return this.http.post(`${this.configService.getContactApiUrl()}/admin/${contactId}/respond?response=${encodeURIComponent(response)}`, {});
  }

  // Close contact
  closeContact(contactId: number): Observable<any> {
    return this.http.post(`${this.configService.getContactApiUrl()}/admin/${contactId}/close`, {});
  }

  // Get contact statistics
  getContactStats(): Observable<any> {
    return this.http.get(`${this.configService.getContactApiUrl()}/admin/stats`);
  }
}
