// src/app/pages/categories/categories.component.ts
/* import { Component, OnInit }          from '@angular/core';
import { Router }                     from '@angular/router';
import { CategoryService }            from '../../services/category.service';
import { Category }                   from '../../models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Array<Category & { icon: string }> = [];

  private iconsMap: Record<string, string> = {
    Smartphones:     'fas fa-mobile-alt',
    Laptops:         'fas fa-laptop',
    Cameras:         'fas fa-camera',
    Fashion:         'fas fa-tshirt',
    Watches:         'fas fa-clock',
    HomeAppliances:'fas fa-blender',
    Books:           'fas fa-book',
    Sports:          'fas fa-football-ball',
    Gaming:          'fas fa-gamepad',
    Monitors:        'fas fa-desktop',
    Cosmetics:       'fas fa-spray-can',
    Supermarket:     'fas fa-shopping-basket',
    Toys:            'fas fa-puzzle-piece',
    Others:          'fas fa-ellipsis-h',
  };

  constructor(
    private router: Router,
    private categorySvc: CategoryService
  ) {}

  ngOnInit(): void {
    this.categorySvc.getCategories().subscribe(list => {
      this.categories = list.map(cat => ({
        ...cat,
        icon: this.iconsMap[cat.categoryName] || 'fas fa-tag'
      }));
    });
  }

  goToCategory(cat: Category): void {
    this.router.navigate(['/products'], {
      queryParams: { category: cat.categoryName }
    });
  }
}
 */

// src/app/pages/categories/categories.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  /** Statik kategori listesi; sunucudan çekecekseniz burada servis çağırıp doldurabilirsiniz */
  categories = [
    { id: 1,  name: 'Smartphones',     icon: 'fas fa-mobile-alt'     },
    { id: 2,  name: 'Laptops',         icon: 'fas fa-laptop'         },
    { id: 3,  name: 'Cameras',         icon: 'fas fa-camera'         },
    { id: 4,  name: 'Fashion',         icon: 'fas fa-tshirt'         },
    { id: 5,  name: 'Watches',         icon: 'fas fa-clock'           },
    { id: 6,  name: 'Home Appliances', icon: 'fas fa-blender'         },
    { id: 7,  name: 'Books',           icon: 'fas fa-book'            },
    { id: 8,  name: 'Sports',          icon: 'fas fa-football-ball'   },
    { id: 9,  name: 'Gaming',          icon: 'fas fa-gamepad'         },
    { id: 10, name: 'Monitors',        icon: 'fas fa-desktop'         },
    { id: 11, name: 'Cosmetics',       icon: 'fas fa-spray-can'       },
    { id: 12, name: 'Supermarket',     icon: 'fas fa-shopping-basket' },
    { id: 13, name: 'Toys',            icon: 'fas fa-puzzle-piece'    },
    { id: 14, name: 'Others',          icon: 'fas fa-ellipsis-h'      }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Eğer kategori listesini API'den alacaksanız burada çağırın:
    // this.categoryService.getAll().subscribe(list => this.categories = list);
  }

  /** Kart tıklandığında ürün sayfasına `?categoryId=...` ile yönlendirir */
  goToCategory(cat: { id: number; name: string; icon: string }): void {
    this.router.navigate(['/products'], {
      queryParams: { categoryId: cat.id }
    });
  }
}
