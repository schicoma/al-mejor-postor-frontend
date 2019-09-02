import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { environment } from '../environments/environment';

//Components
import { ProductsComponent } from './components/products/products.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductComponent } from './components/products/product/product.component';

//Services
import { ProductService } from './services/product.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/views/login/login.component';
import { CreateAccountComponent } from './components/views/create-account/create-account.component';
import { SearchComponent } from './components/views/search/search.component';
import { PageNotFoundComponent } from './components/views/page-not-found/page-not-found.component';
import { ProductDetailComponent } from './components/views/product-detail/product-detail.component';
import { UsuariosService } from './services/usuarios.service';
import { AuthService } from './services/core/auth.service';
import { VerifyAccountComponent } from './components/views/verify-account/verify-account.component';
import { MustMatchDirective } from './directives/must-match.directive';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    ProductListComponent,
    ProductComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    CreateAccountComponent,
    SearchComponent,
    PageNotFoundComponent,
    ProductDetailComponent,
    VerifyAccountComponent,
    MustMatchDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    AngularFirestore,
    ProductService,
    UsuariosService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
