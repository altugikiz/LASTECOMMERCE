import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StripeService } from '../../services/stripe.service';
import { StripeCardElement } from '@stripe/stripe-js';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: false
})
export class PaymentComponent implements OnInit {
  @ViewChild('cardInfo', { static: false }) cardInfo!: ElementRef;
  loading = false;
  error: string | null = null;
  success = false;

  private cardElement!: StripeCardElement;
  public isCardReady = false; 

  constructor(private stripeService: StripeService) {}

  ngOnInit(): void {
    this.stripeService
      .getStripe()
      .then(stripe => {
        if (!stripe) throw new Error();
        const elements = stripe.elements();
        this.cardElement = elements.create('card', {
          style: { base: { fontSize: '16px' } },
          hidePostalCode: true     // ← ZIP kodu alanını gizle
        });
        this.cardElement.mount(this.cardInfo.nativeElement);
        this.isCardReady = true;
      })
      .catch(err => {
        this.error = 'Stripe yüklenirken hata: ' + err.message;
      });
  }

  pay(): void {
    if (!this.isCardReady) {
      this.error = 'Kart bilgisi hazır değil';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = false;

    // Örnek olarak sabit email, tutar ve para birimi
    this.stripeService
      .createCustomer('user@example.com')
      .pipe(
        switchMap(customerId => 
          this.stripeService.createPaymentIntent(10000, 'usd')
        ),
        switchMap(clientSecret =>
          this.stripeService.confirmCardPayment(clientSecret, this.cardElement)
        )
      )
      .subscribe({
        next: result => {
          this.loading = false;
          if (result.error) {
            this.error = result.error.message;
          } else if (result.paymentIntent?.status === 'succeeded') {
            this.success = true;
          }
        },
        error: err => {
          this.loading = false;
          this.error = err.message || 'Ödeme sırasında hata oluştu';
        }
      });
  }
}
