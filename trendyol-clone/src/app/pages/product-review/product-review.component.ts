// src/app/components/product-review/product-review.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { ProductService }    from '../../services/product.service';
import { Product }           from '../../models/product.model';
import { ToastService }      from '../../services/toast.service';
import { ReviewService }     from '../../services/review.service';
import { Review }            from '../../models/review.model';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss'],
  standalone: false
})
export class ProductReviewComponent implements OnInit {
  product!: Product;
  newRating: number | null = null;
  newComment: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe(prod => {
      this.product = prod;
    });
  }

  submitFeedback(): void {
    if (!this.product) return;

    const productId = this.product.id;
    const userId = /* AuthService’dan alınacak */ 1;
    const comment = this.newComment.trim();
    const rating  = this.newRating ?? 0;

    this.reviewService
      .add(productId, userId, comment, rating)
      .subscribe(
        (review: Review) => {
          // Yeni review’ü liste başına ekle
          this.product.reviews = [review, ...(this.product.reviews || [])];
          // Ortalama puanı güncelle
          const revs = this.product.reviews!;
          this.product.avgRating = revs.length
            ? revs.reduce((sum, r) => sum + r.rating, 0) / revs.length
            : 0;

          this.toastService.showToast('Feedback submitted successfully!');
          // Formu temizle
          this.newComment = '';
          this.newRating  = null;
        },
        (err) => {
          this.toastService.showToast('Failed to submit feedback.');
        }
      );
  }
}
