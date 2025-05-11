// src/app/checkout/checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { StripeService } from '../../services/stripe.service'; // kendi servisin
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { StripeElements } from '@stripe/stripe-js';
import { StripeElement } from '@stripe/stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  stripe!: Stripe | null;
  elements: StripeElements | null = null;
  card!: StripeCardElement;
  isLoading = false;
  error: string | null = null;

  // örnek sabit tutuyoruz
  amount = 15000; // 49.99 USD = 4999 cents
  currency: 'USD' = 'USD';

  constructor(private stripeService: StripeService) {}

  async ngOnInit() {
  this.stripe = await loadStripe('pk_test_…');
  if (this.stripe) {
    this.elements = this.stripe.elements();
    this.card = this.elements.create('card'); // → StripeCardElement
    this.card.mount('#card-element');

    // artık on() metodunu kullanabilirsiniz
    this.card.on('change', (event: StripeCardElementChangeEvent) => {
      this.error = event.error?.message ?? null;
    });
  }
}

  async pay() {
  this.isLoading = true;
  this.error = null;

  try {
    // 1) Ödeme isteğini başlatıp clientSecret alın
    const amountInCents = Math.round(this.amount * 100);
    const obs$ = this.stripeService.createPaymentIntent(amountInCents, 'USD');
    const clientSecret: string = await firstValueFrom(obs$);

    if (!clientSecret) {
      this.error = 'Ödeme başlatılamadı';
      return;
    }

    // 2) Kartı Stripe Elements üzerinden onayla
    const { error, paymentIntent } = await this.stripe!.confirmCardPayment(
      clientSecret,
      { payment_method: { card: this.card! } }
    );

    if (error) {
      this.error = error.message || 'Ödeme sırasında bir hata oluştu';
    } else {
      console.log('Ödeme başarılı:', paymentIntent);
      // Burada kullanıcıyı yönlendirebilirsiniz…
    }
  } catch (err: any) {
    this.error = err.message || 'Sunucu ile bağlantıda sorun oluştu';
  } finally {
    this.isLoading = false;
  }
}

}
