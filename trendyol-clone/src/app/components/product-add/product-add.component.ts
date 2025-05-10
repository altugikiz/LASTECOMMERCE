/* import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-add',
  standalone: false,
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.scss'
})
export class ProductAddComponent {
  name: string = '';
  description: string = '';
  price: number = 0;
  category: string = '';
  selectedFile!: File;
  errorMessage: string = '';

  constructor(private productService: ProductService, private http: HttpClient, private router: Router) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  addProduct(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image.';
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post('http://localhost:8080/api/products/upload', formData, { responseType: 'text' })
      .subscribe({
        next: (imageUrl) => {
          const newProduct = {
            name: this.name,
            description: this.description,
            price: this.price,
            category: this.category,
            imageUrl: imageUrl
          };

          this.productService.createProduct(newProduct).subscribe({
            next: () => {
              this.router.navigate(['/']);
            },
            error: () => {
              this.errorMessage = 'Product creation failed.';
            }
          });
        },
        error: () => {
          this.errorMessage = 'Image upload failed.';
        }
      });
  }
}
 */


import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
  standalone: false
})
export class ProductAddComponent {
  name = '';
  description = '';
  price: number | null = null;
  category = '';
  selectedFile!: File;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  addProduct(): void {
    this.errorMessage = '';
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image.';
      return;
    }
    if (!this.name || !this.description || this.price === null || !this.category) {
      this.errorMessage = 'All fields are required.';
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post<string>('/api/products/upload', formData)
      .subscribe({
        next: (imageUrl) => {
          const newProduct = {
            name: this.name,
            description: this.description,
            price: this.price,
            category: this.category,
            imageUrl
          } as Product;

          this.productService.createProduct(newProduct)
            .subscribe({
              next: () => this.router.navigate(['/']),
              error: () => this.errorMessage = 'Product creation failed.'
            });
        },
        error: () => this.errorMessage = 'Image upload failed.'
      });
  }
}
