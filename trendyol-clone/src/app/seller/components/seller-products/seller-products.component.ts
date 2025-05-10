// src/app/seller/components/seller-products/seller-products.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SellerService } from '../../services/seller.service';
import { SellerProduct } from '../../models/product.model';

@Component({
  selector: 'app-seller-products',
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.scss'],
  standalone: false
})
export class SellerProductsComponent implements OnInit {
  products: SellerProduct[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private sellerService: SellerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.sellerService.getProducts().subscribe({
      next: list => {
        this.products = list;
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to load products.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  createProduct(): void {
    this.router.navigate(['/seller/products/new']);
  }

  editProduct(id: number): void {
    this.router.navigate([`/seller/products/${id}/edit`]);
  }

  deleteProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) return;
    this.sellerService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: err => {
        alert('Delete failed');
        console.error(err);
      }
    });
  }
}
