// src/app/seller/services/seller.service.tsimport
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DashboardData } from '../models/dashboard.model';
import { SellerProduct } from '../models/product.model';
import { SellerOrder } from '../models/order.model';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model'; // Eğer genel ürün detayına ihtiyacın varsa
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private baseUrl = '/api/seller';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  private getSellerId(): number {
    const id = this.auth.getUserId();
    return id ? +id : -1;
  }

  // 📊 Dashboard
  getDashboard(): Observable<DashboardData> {
  const sellerId = this.getSellerId();
  return this.http.get<DashboardData>(`${this.baseUrl}/dashboard?sellerId=${sellerId}`);
}

  // 📦 Ürün listesi
  getProducts(): Observable<SellerProduct[]> {
    const sellerId = this.getSellerId(); // 🔐 AuthService'ten alınıyor
    return this.http.get<SellerProduct[]>(`${this.baseUrl}/products?sellerId=${sellerId}`);
  }

  // 🛒 Sipariş listesi
  getOrders(): Observable<SellerOrder[]> {
    const sellerId = this.getSellerId();
    return this.http.get<SellerOrder[]>(
      `${this.baseUrl}/orders?sellerId=${sellerId}`
    );
  }

  // ➕ Yeni ürün ekle
  createProduct(product: SellerProduct): Observable<SellerProduct> {
    const sellerId = this.getSellerId();
    return this.http.post<SellerProduct>(
      `${this.baseUrl}/products?sellerId=${sellerId}`,
      product
    );
  }

  // ✏️ Var olan ürünü güncelle
  updateProduct(id: number, product: SellerProduct): Observable<SellerProduct> {
    const sellerId = this.getSellerId();
    return this.http.put<SellerProduct>(
      `${this.baseUrl}/products/${id}?sellerId=${sellerId}`,
      product
    );
  }

  // ❌ Ürünü sil
  deleteProduct(id: number): Observable<void> {
  const sellerId = this.getSellerId();
  return this.http.delete<void>(
    `${this.baseUrl}/products/${id}?sellerId=${sellerId}`
  );
}
}



// src/app/seller/services/seller.service.ts
/* import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DashboardData } from '../models/dashboard.model';
import { SellerProduct } from '../models/product.model';
import { SellerOrder }   from '../models/order.model';
import { AuthService }   from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private baseUrl = '/api/seller';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  // Dashboard verisi 
  getDashboard(): Observable<DashboardData> {
    const sellerId = this.getSellerId();
    return this.http.get<DashboardData>(
      `${this.baseUrl}/dashboard?sellerId=${sellerId}`
    );
  }

  // Satıcının ürünleri 
  getProducts(): Observable<SellerProduct[]> {
    const sellerId = this.getSellerId();
    return this.http.get<SellerProduct[]>(
      `${this.baseUrl}/products?sellerId=${sellerId}`
    );
  }

  // Satıcının siparişleri 
  getOrders(): Observable<SellerOrder[]> {
    const sellerId = this.getSellerId();
    return this.http.get<SellerOrder[]>(
      `${this.baseUrl}/orders?sellerId=${sellerId}`
    );
  }

  // Token’dan aldığımız kullanıcı ID’si 
  private getSellerId(): number {
    const id = this.auth.getUserId();
    return id ? Number(id) : -1;
  }

  // Yeni ürün ekle 
  createProduct(product: SellerProduct): Observable<SellerProduct> {
    const sellerId = this.getSellerId();
    return this.http.post<SellerProduct>(
      `${this.baseUrl}/products?sellerId=${sellerId}`,
      product
    );
  }

  // Var olan ürünü güncelle 
  updateProduct(id: number, product: SellerProduct): Observable<SellerProduct> {
    const sellerId = this.getSellerId();
    return this.http.put<SellerProduct>(
      `${this.baseUrl}/products/${id}?sellerId=${sellerId}`,
      product
    );
  }

  // Ürünü sil 
  deleteProduct(id: number): Observable<void> {
    const sellerId = this.getSellerId();
    return this.http.delete<void>(
      `${this.baseUrl}/products/${id}?sellerId=${sellerId}`
    );
  }
}
 */