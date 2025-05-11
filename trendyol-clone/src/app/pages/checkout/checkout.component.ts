import { Component, OnInit } from '@angular/core';
import { StripeService } from '../../services/stripe.service';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

import { loadStripe, Stripe, StripeCardElement, StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { StripeElements } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { OrderRequest } from '../../models/order-request.model';

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

  amount = 150; // dolar değil TL gibi, backend 150.00 almalı
  currency: 'USD' = 'USD';

  constructor(
    private stripeService: StripeService,
    private orderService: OrderService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_...');
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
      this.card.on('change', (event: StripeCardElementChangeEvent) => {
        this.error = event.error?.message ?? null;
      });
    }
  }

  async pay() {
    this.isLoading = true;
    this.error = null;

    try {
      const amountInCents = this.amount * 100;
      const obs$ = this.stripeService.createPaymentIntent(amountInCents, this.currency);
      const clientSecret: string = await firstValueFrom(obs$);

      if (!clientSecret) {
        this.error = 'Ödeme başlatılamadı';
        return;
      }

      const { error, paymentIntent } = await this.stripe!.confirmCardPayment(
        clientSecret,
        { payment_method: { card: this.card! } }
      );

      if (error) {
        this.error = error.message || 'Ödeme sırasında hata oluştu';
        return;
      }

      // 🧾 Sipariş oluşturma
      const email = this.authService.getEmailFromToken();
      if (!email) {
        this.error = 'Kullanıcı oturumu geçersiz';
        return;
      }

      const items = this.cartService.getCartItems();
      const productNames = items.map(i => i.product.name);
      const totalPrice = this.cartService.getTotalPrice();

      const orderRequest: OrderRequest = { userEmail: email, productNames, totalPrice };
      await firstValueFrom(this.orderService.createOrderAfterCheckout(orderRequest));

      this.cartService.clearCart();
      alert('Ödeme ve sipariş başarıyla tamamlandı');
    } catch (err: any) {
      this.error = err.message || 'Sunucu ile bağlantı hatası';
    } finally {
      this.isLoading = false;
    }
  }
}
