import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartMap = new Map<number, { product: Product; quantity: number }>();

  cartItems$ = new BehaviorSubject<{ product: Product; quantity: number }[]>([]);
  cartCount$ = new BehaviorSubject<number>(0);

  constructor() {}

  addToCart(product: Product): void {
    const entry = this.cartMap.get(product.id);

    if (entry) {
      entry.quantity += 1;
    } else {
      this.cartMap.set(product.id, { product, quantity: 1 });
    }

    this.updateState();
  }

  getCartItems(): { product: Product; quantity: number }[] {
    return Array.from(this.cartMap.values());
  }

  clearCart(): void {
    this.cartMap.clear();
    this.updateState();
  }

  getTotalPrice(): number {
    return Array.from(this.cartMap.values()).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  removeFromCart(productId: number): void {
    const entry = this.cartMap.get(productId);

    if (entry) {
      if (entry.quantity > 1) {
        entry.quantity -= 1;
      } else {
        this.cartMap.delete(productId);
      }
    }

    this.updateState();
  }

  private updateState(): void {
    const itemsArray = Array.from(this.cartMap.values());
    const totalCount = itemsArray.reduce((sum, item) => sum + item.quantity, 0);

    this.cartItems$.next(itemsArray);
    this.cartCount$.next(totalCount);
  }
}
