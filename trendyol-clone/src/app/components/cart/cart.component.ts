import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: { product: Product, quantity: number }[] = [];
  successMessage: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.successMessage = '';
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  checkout(): void {
    const email = this.authService.getEmailFromToken();

    if (!email) {
      alert('You must be logged in to place an order.');
      this.router.navigate(['/login']);
      return;
    }

    const order = {
      userEmail: email,
      productNames: this.cartItems.map(item => `${item.product.name} x${item.quantity}`),
      totalPrice: this.getTotal()
    };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.successMessage = 'Your order has been placed successfully!';
        this.toastService.showToast('Your order has been placed successfully!');
        this.clearCart();

        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.toastService.showToast('Failed to place the order. Please try again later.');
      }
    });
  }
}