// src/app/services/payment-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { StripeService } from './stripe.service';
import { StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';

interface Secret { clientSecret: string; }
interface PM { 
  id: string; 
  card: {
    last4: string; 
    brand: string; 
    exp_month: number; 
    exp_year: number; 
  }; 
}

@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  private apiUrl = '${environment.apiUrl}/payments';

  constructor(
    private http: HttpClient,
    private stripeService: StripeService
  ) {}

  /** Backend’den SetupIntent clientSecret alır */
  createSetupIntent(customerId: string): Observable<string> {
    return this.http
      .post<Secret>('/api/payments/setup-intent', { customerId })
      .pipe(map(r => r.clientSecret));
  }

  /** Backend’den o müşteri için kayıtlı kartları listeler */
  listPaymentMethods(customerId: string): Observable<PM[]> {
    return this.http
      .get<PM[]>(`/api/payments/methods?customerId=${customerId}`);
  }

  /** Backend’den o kullanıcıya ait ödeme geçmişini çeker */
  listUserPayments(userId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`/api/payments/user/${userId}`);
  }

  /** 
   * Stripe.js ile gelen SetupIntent clientSecret’i onaylar
   * (kartı Stripe’a kaydeder)
   */
  confirmCardSetup(
    clientSecret: string,
    card: StripeCardElement
  ): Observable<any> {
    return from(
      this.stripeService.getStripe().then(stripe => {
        if (!stripe) throw new Error('Stripe yüklenemedi');
        return stripe.confirmCardSetup(clientSecret, {
          payment_method: { card }
        });
      })
    );
  }
}
