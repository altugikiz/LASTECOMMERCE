import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) { }

  // 🛒 Sipariş oluşturmak için
  createOrder(order: any): Observable<any> {
    return this.http.post(this.baseUrl, order);
  }

  // 🛒 Tüm siparişleri çekmek için
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // 🛒 Email'e göre siparişleri çekmek (Opsiyonel kullanım için hazırda dursun)
  getOrdersByUserEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${email}`);
  }

  // 🛒 Kullanıcının tüm siparişlerini email ile silmek
  deleteOrdersByUserEmail(email: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/user/${email}`);
  }
}