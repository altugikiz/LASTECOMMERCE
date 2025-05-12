import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from '../../services/seller.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, of, throwError } from 'rxjs';
import { SellerProduct } from '../../models/product.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-seller-product-form',
  templateUrl: './seller-product-form.component.html',
  styleUrls: ['./seller-product-form.component.scss'],
  standalone: false
})
export class SellerProductFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  productId!: number;
  submitting = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private sellerService: SellerService,
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 1. Form oluşturuluyor
    this.form = this.fb.group({
      name:        ['', Validators.required],
      description: ['', Validators.required],
      price:       [0, [Validators.required, Validators.min(0.01)]],
      stock:       [0, [Validators.required, Validators.min(0)]],
      image:       ['', Validators.required], // imageUrl yerine image
      categoryId:  ['', Validators.required]
    });

    // 2. Edit mod kontrolü
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEdit = true;
      this.productId = +idParam;

      this.sellerService.getProducts().pipe(
        switchMap(list => {
          const product = list.find(p => p.id === this.productId);
          return product ? of(product) : throwError(() => new Error('Ürün bulunamadı'));
        })
      ).subscribe({
        next: product => this.form.patchValue(product),
        error: () => this.router.navigate(['/seller/products'])
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMsg = 'Lütfen tüm zorunlu alanları doldurun.';
      return;
    }

    const sellerId = this.authService.getUserId();
    if (!sellerId) {
      this.errorMsg = 'Giriş yapan satıcı tespit edilemedi.';
      return;
    }

    const payload: SellerProduct = {
      ...this.form.value,
      sellerId: +sellerId
    };

    this.submitting = true;

    const request$ = this.isEdit
      ? this.sellerService.updateProduct(this.productId, payload)
      : this.sellerService.createProduct(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/seller/products']),
      error: err => {
        this.errorMsg = err.error?.message || err.message || 'Ürün kaydedilirken bir hata oluştu.';
        this.submitting = false;
      }
    });
  }
}
