// src/app/components/navbar/navbar.component.ts

import { Component, OnInit } from '@angular/core';
import { Router }               from '@angular/router';
import { AuthService }          from '../../services/auth.service';
import { CartService }          from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false
})
export class NavbarComponent implements OnInit {
  cartItemCount = 0;
  bounce        = false;

  constructor(
    public  auth: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
      this.triggerBounce();
    });
  }

  /** Kullanıcının giriş yapıp yapmadığını kontrol eder */
  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  /** Admin rolü var mı? */
  hasAdmin(): boolean {
    return this.auth.hasRole('ADMIN');
  }

  /** Seller rolü var mı? */
  hasSeller(): boolean {
    return this.auth.hasRole('SELLER');
  }

  /** Sepet simgesine kısa animasyon */
  private triggerBounce(): void {
    this.bounce = true;
    setTimeout(() => this.bounce = false, 600);
  }

  /** Çıkış yap ve login sayfasına yönlendir */
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}