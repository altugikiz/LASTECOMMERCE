// src/app/admin/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable }   from 'rxjs';

import { AdminProduct }       from '../adminModels/adminProduct.model';
import { AdminOrder }         from '../adminModels/adminOrder.model';
import { AdminUser }          from '../adminModels/adminUser.model';
import { AdminSellerRequest } from '../adminModels/adminSellerRequest.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/admin';
  


  constructor(private http: HttpClient) {}

  // ---------- Product CRUD ----------
  getProducts(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>('http://localhost:8080/api/products');
  }

  createProduct(p: AdminProduct): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(`${this.baseUrl}/products`, p);
  }

  updateProduct(p: AdminProduct): Observable<AdminProduct> {
    return this.http.put<AdminProduct>(`${this.baseUrl}/products/${p.id}`, p);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }

  // ---------- Order Management ----------
  getOrders(): Observable<AdminOrder[]> {
    return this.http.get<AdminOrder[]>(`${this.baseUrl}/orders`);
  }

  // ---------- User Management ----------
  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.baseUrl}/users`);
  }

  banUser(id: number): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.baseUrl}/users/${id}/ban`, {});
  }

  unbanUser(id: number): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.baseUrl}/users/${id}/unban`, {});
  }

  // ---------- Seller Requests ----------
  /** Bekleyen satıcı taleplerini çeker */
  getSellerRequests(): Observable<AdminSellerRequest[]> {
    // GET http://localhost:8080/api/admin/seller-requests
    return this.http.get<AdminSellerRequest[]>(
      `${this.baseUrl}/seller-requests`
    );
  }

  /** Satıcı talebini onaylar */
  // approveSeller(userId: number): Observable<void> {
  //   return this.http.post<void>(
  //     `${this.apiUrl}/users/seller-requests/${userId}/approve-seller`,
  //     {}
  //   );
  // }

  approveSellerRequest(userId: number): Observable<void> {
    // POST http://localhost:8080/api/admin/seller-requests/{userId}/approve
    return this.http.post<void>(
      `${this.baseUrl}/seller-requests/${userId}/approve`,
      {}
    );
  }
}
