import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/views/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CreateAccountComponent } from './components/views/create-account/create-account.component';
import { SearchComponent } from './components/views/search/search.component';
import { PageNotFoundComponent } from './components/views/page-not-found/page-not-found.component';
import { ProductDetailComponent } from './components/views/product-detail/product-detail.component';
import { CreateProductComponent } from './components/views/create-product/create-product.component';
import { CanActivateViaAuth } from './guards/can-activate-via-auth';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'create-account',
    component: CreateAccountComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'create-product',
    component: CreateProductComponent,
    canActivate: [CanActivateViaAuth]
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/page-not-found',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
