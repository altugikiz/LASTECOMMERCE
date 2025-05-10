import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerRoutingModule } from './seller-routing.module';
import { SellerComponent } from './seller.component';
import { MatCardModule } from '@angular/material/card';
import { SellerProductsComponent } from './components/seller-products/seller-products.component';
import { SellerOrdersComponent } from './components/seller-orders/seller-orders.component';
import { SellerDashboardComponent } from './components/seller-dashboard/seller-dashboard.component';
import { SellerLayoutComponent } from './components/seller-layout/seller-layout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SellerProductFormComponent } from './components/seller-product-form/seller-product-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SellerComponent,
    SellerProductsComponent,
    SellerOrdersComponent,
    SellerDashboardComponent,
    SellerLayoutComponent,
    SellerProductFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SellerRoutingModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule
  ]
})
export class SellerModule { }
