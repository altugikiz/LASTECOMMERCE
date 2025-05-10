import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { CartService } from '../../services/cart.service';
import { FavoriteService } from '../../services/favorite.service';
 
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: false
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
 
  descriptionHtml: string = '';
 
  isFavorite: boolean = false;
  addedToCart: boolean = false;
  isFlipped: boolean = false;
 
  constructor(
    private router: Router,
    private toastService: ToastService,
    private cartService: CartService,
    private favoriteService: FavoriteService
  ) {}
 
  ngOnInit(): void {
    this.isFavorite = this.favoriteService.isFavorite(this.product.id);
    this.descriptionHtml = (this.product.description ?? '').replace(/\n/g,'<br>');
  }
 
  addToCart() {
    this.cartService.addToCart(this.product);
    this.toastService.showToast('Product added to cart!');
    this.addedToCart = true;
 
    setTimeout(() => (this.addedToCart = false), 800);
  }
 
  toggleFavorite() {
    if (this.isFavorite) {
      this.favoriteService.removeFavorites(this.product.id);
      this.toastService.showToast('Removed from favorites');
    } else {
      this.favoriteService.addFavorites(this.product);
      this.toastService.showToast('Added to favorites');
    }
    this.isFavorite = !this.isFavorite;
  }
 
  getAverageRating(ratings: number[]): number | null {
    if (!ratings || ratings.length === 0) return null;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  }
 
  flipCard(): void {
    this.isFlipped = !this.isFlipped;
  }
 
  goToReview(): void {
    this.router.navigate(['/product', this.product.id, 'review']);
  }

  ngOnChanges() {
    const desc = this.product.description || '';
    this.descriptionHtml = desc.replace(/\n/g, '<br>');
  }
}