import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Params }          from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

import { ProductService } from '../../services/product.service';
import { Product }        from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: false,
  animations: [
    trigger('dropdownFadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class ProductListComponent implements OnInit {
  products: Product[]         = [];
  filteredProducts: Product[] = [];
  categories: string[]        = [];

  selectedCategory = '';
  searchTerm       = '';
  selectedSort     = '';

  minPrice: number | null = null;
  maxPrice: number | null = null;
  brandFilter  = '';
  genderFilter = '';

  showFilters     = false;
  sortPanelOpen   = false;
  minPriceInvalid = false;
  maxPriceInvalid = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1) Ürünleri yükle
    this.productService.getProducts().subscribe(list => {
      this.products = list;
      this.filteredProducts = [...list];
      this.extractCategories();

      // 2) URL’deki ?category=Sports gibi parametreyi dinle
      this.route.queryParams.subscribe((params: Params) => {
        this.selectedCategory = params['category'] || '';
        this.loadProducts();
      });
    });
  }

  private loadProducts() {
    this.productService.getProducts().subscribe(list => {
      this.products = list;
      this.applyFilters();
    });
  }

  private extractCategories(): void {
    // Ürünlerden unique kategori isimlerini çıkar
    this.categories = Array.from(new Set(this.products.map(p => p.category)));
  }

  applyFilters(): void {
    // fiyat validasyonu
    this.minPriceInvalid = this.minPrice !== null && (isNaN(this.minPrice) || this.minPrice < 0);
    this.maxPriceInvalid = this.maxPrice !== null && (isNaN(this.maxPrice) || this.maxPrice < 0);
    if (this.minPriceInvalid || this.maxPriceInvalid) return;

    let temp = [...this.products];
    const term = this.searchTerm.trim().toLowerCase();

    // kategori filtresi
    if (this.selectedCategory) {
      temp = temp.filter(p => p.category === this.selectedCategory);
    }
    // metin arama
    if (term) {
      temp = temp.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }
    // fiyat aralığı
    if (this.minPrice != null) {
      temp = temp.filter(p => p.price >= this.minPrice!);
    }
    if (this.maxPrice != null) {
      temp = temp.filter(p => p.price <= this.maxPrice!);
    }
    // marka
    if (this.brandFilter.trim()) {
      const b = this.brandFilter.trim().toLowerCase();
      temp = temp.filter(p => p.brand?.toLowerCase().includes(b));
    }
    // cinsiyet
    if (this.genderFilter) {
      temp = temp.filter(p => p.gender?.toLowerCase() === this.genderFilter.toLowerCase());
    }

    this.filteredProducts = temp;
    this.sortProducts();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  searchProducts(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  sortProducts(): void {
    switch (this.selectedSort) {
      case 'priceAsc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'ratingDesc':
        this.filteredProducts.sort((a, b) =>
          (b.avgRating ?? 0) - (a.avgRating ?? 0)
        );
        break;
      case 'nameAsc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
  }

  toggleFilterPanel(): void {
    this.showFilters = !this.showFilters;
  }
  toggleSortPanel(): void {
    this.sortPanelOpen = !this.sortPanelOpen;
  }

  clearAllFilters(): void {
    this.selectedCategory = '';
    this.searchTerm       = '';
    this.selectedSort     = '';
    this.minPrice = this.maxPrice = null;
    this.brandFilter       = '';
    this.genderFilter      = '';
    this.applyFilters();
  }
  clearSort(): void {
    this.selectedSort = '';
    this.applyFilters();
  }

  public validateMinPrice(): void {
    this.minPriceInvalid = this.minPrice !== null && (isNaN(this.minPrice) || this.minPrice < 0);
  }
  public validateMaxPrice(): void {
    this.maxPriceInvalid = this.maxPrice !== null && (isNaN(this.maxPrice) || this.maxPrice < 0);
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement): void {
    const sortBtn     = document.querySelector('.sort-toggle');
    const sortPanel   = document.querySelector('.sort-panel');
    const filterBtn   = document.querySelector('.filter-toggle');
    const filterPanel = document.querySelector('.filter-panel');

    if (this.sortPanelOpen && sortPanel && !sortPanel.contains(target) && sortBtn && !sortBtn.contains(target)) {
      this.sortPanelOpen = false;
    }
    if (this.showFilters && filterPanel && !filterPanel.contains(target) && filterBtn && !filterBtn.contains(target)) {
      this.showFilters = false;
    }
  }
}
