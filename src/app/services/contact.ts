import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8089/api/contact';

  constructor(private http: HttpClient) { }

  // ==================== PUBLIC ENDPOINTS ====================

  // Submit contact form
  submitContact(contact: ContactForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, contact);
  }

  // ==================== ADMIN ENDPOINTS ====================

  // Get all contacts
  getAllContacts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/all`);
  }

  // Get contacts by status
  getContactsByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/status/${status}`);
  }

  // Get contact by ID
  getContactById(contactId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/${contactId}`);
  }

  // Respond to contact
  respondToContact(contactId: number, response: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/${contactId}/respond?response=${encodeURIComponent(response)}`, {});
  }

  // Close contact
  closeContact(contactId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/${contactId}/close`, {});
  }

  // Get contact statistics
  getContactStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/stats`);
  }
}
