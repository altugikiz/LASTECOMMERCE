// src/app/seller/components/seller-product-form/seller-product-form.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SellerService } from '../../services/seller.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, of, throwError } from 'rxjs';
import { SellerProduct } from '../../models/product.model';  // ← Burada

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
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1) Form kontrolleri
    this.form = this.fb.group({
      name:        ['', [Validators.required]],
      description: ['', [Validators.required]],
      price:       [0,  [Validators.required, Validators.min(0)]],
      stock:       [0,  [Validators.required, Validators.min(0)]],
      imageUrl:    ['', [Validators.required]],
      category:    ['', [Validators.required]],
      isActive:    [true]
    });

    // 2) Düzenleme modunu kontrol et
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit    = true;
      this.productId = +idParam;

      // a) Eğer servisinizde tek ürün getiren bir metod varsa onu kullanın:
      // this.sellerService.getProduct(this.productId).subscribe({ next: p => this.form.patchValue(p) });

      // b) Ya da tüm listeyi çekip içinde bulacaksanız:
      this.sellerService.getProducts().pipe(
        switchMap(list => {
          const p = list.find(x => x.id === this.productId);
          return p ? of(p) : throwError(() => new Error('Ürün bulunamadı'));
        })
      ).subscribe({
        next: p => this.form.patchValue(p),
        error: () => this.router.navigate(['/seller/products'])
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMsg = 'Lütfen tüm zorunlu alanları doldurun.';
      return;
    }

    this.submitting = true;
    // 3) Payload olarak SellerProduct tipini veriyoruz
    const payload = this.form.value as SellerProduct;

    const request$ = this.isEdit
      ? this.sellerService.updateProduct(this.productId, payload)
      : this.sellerService.createProduct(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/seller/products']),
      error: err => {
        this.errorMsg   = err.error?.message || err.message || 'Bir hata oluştu';
        this.submitting = false;
      }
    });
  }
}
