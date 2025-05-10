// src/app/admin/components/products/products.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminProduct } from '../../adminModels/adminProduct.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  standalone: false,
})
export class ProductsComponent implements OnInit {
  products: AdminProduct[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = null;
    this.adminService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.error = 'An error occurred while loading products.';
        this.isLoading = false;
      }
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    this.adminService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => {
        console.error('Failed to delete product', err);
        this.error = 'An error occurred while deleting the product.';
      }
    });
  }
}
