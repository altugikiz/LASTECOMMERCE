// src/app/services/stripe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class StripeService {

  private apiUrl = `${environment.apiUrl}/payments`;
  private stripePromise = loadStripe(environment.stripePublishableKey);

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe(environment.stripePublishableKey);
  }

  /** 1) Stripe.js yüklemesini getiren metot */
  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  /** 2) Sunucuda Customer yaratır, ID’yi döner */
  createCustomer(email: string): Observable<string> {
    return this.http
      .post<{ id: string }>(
        `${environment.apiUrl}/payments/customers`,
        { email } , {
          headers: {Authorization: 'Bearer ${enviroment.stripeSecretKey}'}
        }
      )
      .pipe(map(res => res.id));
  }

  /** 3) Sunucuda PaymentIntent yaratır, clientSecret’i döner */
  createPaymentIntent(amount: number, currency: string): Observable<string> {
    return this.http
      .post<{ clientSecret: string }>(
        `${environment.apiUrl}/payments/payment-intents`,
        { amount, currency } , {
          headers: {Authorization: 'Bearer ${enviroment.stripeSecretKey}'} 
        }
      )
      .pipe(map(res => res.clientSecret));
  }

  /** 4) Stripe.js üzerinden kartı onaylar */
  confirmCardPayment(
    clientSecret: string,
    card: StripeCardElement
  ): Observable<any> {
    return from(
      this.stripePromise.then(stripe => {
        if (!stripe) throw new Error('Stripe yüklenemedi');
        return stripe.confirmCardPayment(clientSecret, {
          payment_method: { card }
        });
      })
    );
  }

  getPaymentMethods(customerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payments/methods`, {
      params: { customerId }
    });
  }
}
