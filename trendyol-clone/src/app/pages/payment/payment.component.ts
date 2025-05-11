// src/app/features/payment/payment.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { StripeService } from '../../services/stripe.service';
import { PaymentApiService } from '../../services/payment-api.service';
import { StripeCardElement } from '@stripe/stripe-js';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

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

  // Mode: 'save-card' veya 'payment'
  public mode: 'save-card' | 'payment' = 'payment';
  // SetupIntent clientSecret
  private clientSecret = '';
  // Stripe customerId (storag’dan veya yeni yaratacağız)
  private customerId = '';

  constructor(
    private stripeService: StripeService,
    private paymentApi: PaymentApiService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService // ← buraya ekle
  ) {}

  ngOnInit(): void {
  // 0) Stripe customer ID’yi token’dan al
  this.customerId = this.auth.getStripeCustomerIdFromToken() || '';
  console.log('Stripe customer ID:', this.customerId);

  if (!this.customerId) {
    this.error = 'Stripe müşteri ID bulunamadı. Giriş yapmayı deneyin.';
    return;
  }

  // 1) Mode tespiti
  const path = this.route.snapshot.routeConfig?.path || '';
  this.mode = path.includes('save-card') ? 'save-card' : 'payment';

  // 2) Kart elementi mount
  this.stripeService.getStripe().then(stripe => {
    if (!stripe) throw new Error('Stripe yüklenemedi');
    const elements = stripe.elements();
    this.cardElement = elements.create('card', {
      style: { base: { fontSize: '16px' } },
      hidePostalCode: true
    });
    this.cardElement.mount(this.cardInfo.nativeElement);
    this.isCardReady = true;

    // 3) Eğer kaydetme modundaysak SetupIntent al
    if (this.mode === 'save-card') {
      this.initSaveCardFlow();
    }
  })
  .catch(err => {
    this.error = 'Stripe yüklenirken hata: ' + err.message;
  });
}


  /** Kart kaydetme akışını başlatır */
  private initSaveCardFlow() {
  if (!this.customerId) {
    this.error = 'Stripe müşteri ID bulunamadı.';
    return;
  }

  this.fetchSetupIntent(); // doğrudan backend'den SetupIntent al
}

  /** SetupIntent için clientSecret’i backend’den al */
  private fetchSetupIntent() {
    this.paymentApi.createSetupIntent(this.customerId)
      .subscribe(secret => this.clientSecret = secret,
                 err => this.error = err.message);
  }

  /** Kartı Stripe’a kaydeder */
  saveCard(): void {
    if (!this.isCardReady || !this.clientSecret) {
      this.error = 'Kart veya gizli anahtar hazır değil';
      return;
    }
    this.loading = true;
    this.paymentApi.confirmCardSetup(this.clientSecret, this.cardElement)
      .subscribe(res => {
        this.loading = false;
        if (res.error) {
          this.error = res.error.message;
        } else {
          // Başarıyla kaydedildi → kart listesini göster
          this.router.navigate(['/account/cards']);
        }
      }, err => {
        this.loading = false;
        this.error = err.message || 'Kart kaydedilirken hata oluştu';
      });
  }

  /** Normal ödeme akışı */
  pay(): void {
    if (this.mode === 'save-card') return; // save-card modunda pay() kullanılmasın
    if (!this.isCardReady) {
      this.error = 'Kart bilgisi hazır değil';
      return;
    }
    this.loading = true;
    this.error = null;
    this.success = false;

    // 1) Önce kayıtlı kart var mı diye kontrol et
    this.paymentApi.listPaymentMethods(this.customerId)
      .pipe(
        switchMap(cards => {
          if (!cards.length) {
            this.loading = false;
            alert('Ödeme yapabilmek için önce kart kaydetmelisiniz.');
            this.router.navigate(['/payment/save-card']);
            
          }
          // 2) Kayıtlı kart varsa direkt PaymentIntent yarat ve onayla
          return this.stripeService.createPaymentIntent(10000, 'usd');
        }),
        switchMap(intentSecret =>
          this.stripeService.confirmCardPayment(intentSecret, this.cardElement)
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
          if (err.message !== 'Kart yok') {
            this.loading = false;
            this.error = err.message || 'Ödeme sırasında hata oluştu';
          }
        }
      });
  }
}
