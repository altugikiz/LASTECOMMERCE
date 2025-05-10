// src/app/seller/seller-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SellerLayoutComponent }       from './components/seller-layout/seller-layout.component';
import { SellerDashboardComponent }    from './components/seller-dashboard/seller-dashboard.component';
import { SellerProductsComponent }     from './components/seller-products/seller-products.component';
import { SellerOrdersComponent }       from './components/seller-orders/seller-orders.component';
import { SellerProductFormComponent }  from './components/seller-product-form/seller-product-form.component';
import { roleGuard }                   from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: SellerLayoutComponent,
    canActivate: [roleGuard],
    data: { role: 'ROLE_SELLER' },
    children: [
      // Dashboard
      { path: 'dashboard', component: SellerDashboardComponent },

      // Ürün listesi
      { path: 'products', component: SellerProductsComponent },

      // Yeni ürün ekleme
      { path: 'products/new', component: SellerProductFormComponent },

      // Mevcut ürünü düzenleme
      { path: 'products/:id/edit', component: SellerProductFormComponent },

      // Siparişler
      { path: 'orders', component: SellerOrdersComponent },

      // rota boşsa dashboard'a yönlendir
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // tanımsız yer → dashboard
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
