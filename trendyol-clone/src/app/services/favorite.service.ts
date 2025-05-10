import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favorites: Product[] = [];
  favorites$ = new BehaviorSubject<Product[]>([]);

  addFavorites(product: Product): void {
    if (!this.favorites.some(p => p.id === product.id)) {
      this.favorites.push(product);
      this.favorites$.next(this.favorites);
    }
  }

  removeFavorites(productId: number): void {
    this.favorites = this.favorites.filter(p => p.id !== productId);
    this.favorites$.next(this.favorites);
  }

  getFavorites(): Product[] {
    return this.favorites;
  }

  isFavorite(productId: number): boolean {
    return this.favorites.some(p => p.id === productId);
  }
  
}
