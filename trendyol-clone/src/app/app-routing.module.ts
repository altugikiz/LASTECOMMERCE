import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent }       from './components/homepage/homepage.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartComponent }           from './components/cart/cart.component';
import { LoginComponent }          from './components/login/login.component';
import { RegisterComponent }       from './components/register/register.component';
import { ProductAddComponent }     from './components/product-add/product-add.component';
import { OrderHistoryComponent }   from './components/order-history/order-history.component';
import { ProductListComponent }    from './components/product-list/product-list.component';

import { FavoritesComponent }          from './pages/favorites/favorites.component';
import { AccountComponent }        from './pages/account/account.component';
import { CategoriesComponent }     from './pages/categories/categories.component';
import { ProductReviewComponent }  from './pages/product-review/product-review.component';
import { PaymentComponent } from './pages/payment/payment.component';

import { AuthGuard }               from './services/auth.guard';
import { roleGuard, roleLoadGuard }from './seller/guards/role.guard';  // path’ı kendine göre düzelt

const routes: Routes = [
  { path: '',                     component: HomepageComponent },
  { path: 'product/:id',          component: ProductDetailsComponent },
  { path: 'product/:id/review',   component: ProductReviewComponent },
  { path: 'cart',                 component: CartComponent,        canActivate: [AuthGuard] },
  { path: 'login',                component: LoginComponent },
  { path: 'register',             component: RegisterComponent },
  { path: 'add-product',          component: ProductAddComponent,  canActivate: [AuthGuard] },
  { path: 'order-history',        component: OrderHistoryComponent,canActivate: [AuthGuard] },
  { path: 'lists',                component: FavoritesComponent,       canActivate: [AuthGuard] },
  { path: 'account',              component: AccountComponent,     canActivate: [AuthGuard] },
  { path: 'categories',           component: CategoriesComponent },
  { path: 'products',             component: ProductListComponent },

  { 
    path: 'payment',              
    component: PaymentComponent,  
    canActivate: [AuthGuard]      // ödeme sayfasını sadece login olmuşlara açmak için
  },

  // seller panel (AuthGuard + seller modül içindeki guard’lar)
  {
    path: 'seller',
    loadChildren: () =>
      import('./seller/seller.module').then(m => m.SellerModule),
    // canLoad: [AuthGuard],        // modül yüklemeden önce login kontrolü
    // canActivate: [AuthGuard]     // doğrudan route ile gelirse
  },

  // admin panel (hem login hem ADMIN rolü)
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule),
    // sadece roleLoadGuard kullanıyoruz çünkü o zaten isLoggedIn() de kontrol ediyor
    canLoad:     [roleLoadGuard],
    canActivate: [AuthGuard, roleGuard],
    data: { role: 'ADMIN' }
  },

  // catch-all
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
