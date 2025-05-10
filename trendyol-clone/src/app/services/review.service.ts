// src/app/services/review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// KESİNLİKLE: kendi interface’inizi silin!
// import { Review } from './review.model'; // ==> SİLİN

// Bunun yerine mutlaka models klasöründeki Review’i import edin:
import { Review } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private base = '/api/products';

  constructor(private http: HttpClient) {}

  /** Bir ürüne ait yorumları listeler */
  list(productId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.base}/${productId}/reviews`);
  }

  /** Yeni yorum/puan ekler */
  add(
    productId: number,
    userId: number,
    comment: string,
    rating: number
  ): Observable<Review> {
    return this.http.post<Review>(
      `${this.base}/${productId}/reviews`,
      { userId, comment, rating }
    );
  }
}
