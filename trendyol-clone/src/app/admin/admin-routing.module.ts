import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent }           from './components/layout/layout.component';
import { DashboardComponent }        from './components/dashboard/dashboard.component';
import { ProductsComponent }         from './components/products/products.component';
import { OrdersComponent }           from './components/orders/orders.component';
import { UsersComponent }            from './components/users/users.component';
import { SellerRequestsComponent }   from './components/seller-requests/seller-requests.component';

import { roleGuard }                 from '../seller/guards/role.guard';  // path kontrol et

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [roleGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: 'dashboard',       component: DashboardComponent },
      { path: 'products',        component: ProductsComponent },
      { path: 'orders',          component: OrdersComponent },
      { path: 'users',           component: UsersComponent },
      { path: 'seller-requests', component: SellerRequestsComponent },

      // /admin → /admin/dashboard
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
