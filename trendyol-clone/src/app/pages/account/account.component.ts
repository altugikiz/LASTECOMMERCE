import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { PaymentApiService } from '../../services/payment-api.service';  // ← ekledik

interface PaymentMethod {
  id: string;
  card: {
    last4: string;
    brand: string;
    exp_month: number;
    exp_year: number;
  };
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  email: string = '';
  roles: string[] = [];
  orders: any[] = [];

  // --- Stripe kart gösterimi için ---
  stripeCustomerId = '';
  paymentMethods: PaymentMethod[] = [];
  loadingMethods = false;
  // -----------------------------------

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private cartService: CartService,
    private paymentApi: PaymentApiService,   // ← inject ettik
    private router: Router
  ) { }

  ngOnInit(): void {
    // 1) Login değilse login sayfasına
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // 2) Email & roller
    this.email = this.authService.getEmailFromToken() || '';
    this.roles = this.authService.getUserRoles();

    // 3) Stripe customer ID al ve kayıtlı kartları getir
    const customerId = this.authService.getStripeCustomerIdFromToken();
    if (!customerId) {
      alert('Stripe müşteri ID bulunamadı. Lütfen hesabınızdan çıkış yapıp tekrar giriş yapın.');
      return;
    }
    this.stripeCustomerId = customerId; // ✅ En önemli düzeltme

    this.loadingMethods = true;
    this.paymentApi
      .listPaymentMethods(this.stripeCustomerId)
      .subscribe({
        next: methods => {
          this.paymentMethods = methods;
          this.loadingMethods = false;
        },
        error: () => this.loadingMethods = false
      });

    // 4) Siparişleri yükle
    this.loadOrders();
  }

  /** Checkout akışını başlatır */
  onCheckout(): void {
    // Eğer müşteri ID yok veya kart yoksa önce kart ekleme sayfasına
    if (!this.stripeCustomerId || this.paymentMethods.length === 0) {
      this.router.navigate(['/payment'], { queryParams: { returnUrl: '/account' } });
    } else {
      // Kart varsa checkout sayfasına geç
      this.router.navigate(['/checkout']);
    }
  }

  private loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: all => this.orders = all.filter(o => o.userEmail === this.email),
      error: err => console.error(err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hasAdmin(): boolean { return this.authService.hasRole('ADMIN'); }
  hasSeller(): boolean { return this.authService.hasRole('SELLER'); }
  gotoPanel(): void {
    if (this.hasAdmin()) this.router.navigate(['/admin']);
    else if (this.hasSeller()) this.router.navigate(['/seller']);
  }


  onAddCard(): void {
  this.router.navigate(['/payment/save-card'], {
    queryParams: { returnUrl: '/account' }
  });
}
}
