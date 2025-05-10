import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }      from '@angular/router';
import { ProductService }      from '../../services/product.service';
import { CartService }         from '../../services/cart.service';
import { ToastService }        from '../../services/toast.service';
import { ReviewService} from '../../services/review.service';
import { Product }            from '../../models/product.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  standalone: false
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  newComment = '';
  newRating = 5;
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private cartService: CartService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe(prod => {
      this.product = prod;
      // Eğer product.reviews gelmemişse, ekstra çek:
      if (!this.product.reviews) {
        this.loadReviews();
      }
    });
  }

  private loadReviews(): void {
    this.reviewService.list(this.product.id).subscribe(revs => {
      this.product.reviews = revs;
      this.updateAvgRating();
    });
  }

  submitReview(): void {
    const userId = /* AuthService’dan alınacak */ 1; 
    this.reviewService
      .add(this.product.id, userId, this.newComment, this.newRating)
      .subscribe({
        next: (r: Review) => {
          // Yorumları ekrana ekle
          this.product.reviews = [r, ...(this.product.reviews || [])];
          this.updateAvgRating();
          this.newComment = '';
          this.newRating = 5;
          this.successMessage = 'Yorumunuz başarıyla eklendi!';
        },
        error: () => {
          this.successMessage = 'Yorum eklenirken hata oluştu.';
        }
      });
  }

  private updateAvgRating(): void {
    const revs = this.product.reviews || [];
    this.product.avgRating = revs.length
      ? revs.reduce((s, x) => s + x.rating, 0) / revs.length
      : 0;
  }

  addToCart(): void {
    this.cartService.addToCart(this.product);
    this.toastService.showToast('Ürün sepete eklendi!');
  }
}
