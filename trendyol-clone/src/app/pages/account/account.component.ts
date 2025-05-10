// src/app/pages/account/account.component.ts
import { Component, OnInit }      from '@angular/core';
import { Router }                 from '@angular/router';
import { CommonModule }           from '@angular/common';
import { AuthService }            from '../../services/auth.service';
import { OrderService }           from '../../services/order.service';
import { CartService }            from '../../services/cart.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  email: string     = '';
  roles: string[]   = [];
  orders: any[]     = [];

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1) Login değilse login sayfasına
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // 2) Email & roller
    this.email = this.authService.getEmailFromToken() || '';
    this.roles = this.authService.getUserRoles();

    // 3) Kullanıcının siparişlerini yükle
    this.loadOrders();
  }

  /** Sepetten sipariş oluştur */
  createOrderFromCart(): void {
    const cartItems = this.cartService.getCartItems();
    if (cartItems.length === 0) {
      alert('Sepetiniz boş!');
      return;
    }
    const productNames = cartItems.map(item => item.product.name);
    const totalPrice   = this.cartService.getTotalPrice();

    this.orderService.createOrder({
      userEmail: this.email,
      productNames,
      totalPrice
    }).subscribe({
      next: order => {
        this.orders.push(order);
        this.cartService.clearCart();
        alert('Sipariş başarıyla oluşturuldu.');
      },
      error: () => alert('Sipariş oluşturulamadı.')
    });
  }

  /** Kullanıcının tüm siparişlerini çek */
  private loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: all => {
        this.orders = all.filter(o => o.userEmail === this.email);
      },
      error: err => console.error(err)
    });
  }

  /** Çıkış yap ve login’e dön */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /** Role kontrolleri ve panellere yönlendirme */
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  hasAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }
  hasSeller(): boolean {
    return this.authService.hasRole('SELLER');
  }
  gotoPanel(): void {
    if (this.hasAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.hasSeller()) {
      this.router.navigate(['/seller']);
    }
  }
}
