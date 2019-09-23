import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NiceSelectModule } from "ng-nice-select";

import { environment } from '../environments/environment';

// Firebase

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

// Services
import { UsuariosService } from './services/usuarios.service';
import { AuthService } from './services/core/auth.service';
import { ProductosService } from './services/productos.service';
import { CategoriasService } from './services/categorias.service';
import { OfertasService } from './services/ofertas.service';

import { CanActivateViaAuth } from './guards/can-activate-via-auth';

// Components
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/views/login/login.component';
import { CreateAccountComponent } from './components/views/create-account/create-account.component';
import { SearchComponent } from './components/views/search/search.component';
import { PageNotFoundComponent } from './components/views/page-not-found/page-not-found.component';
import { ProductDetailComponent } from './components/views/product-detail/product-detail.component';
import { VerifyAccountComponent } from './components/views/verify-account/verify-account.component';
import { CreateProductComponent } from './components/views/create-product/create-product.component';
import { TerminosYCondicionesComponent } from './components/views/terminos-y-condiciones/terminos-y-condiciones.component';
import { MyOffersComponent } from './components/my-offers/my-offers.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';

// Pipes
import { FormatoFechaPipe } from './pipes/formato-fecha.pipe';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { MustMatchDirective } from './directives/must-match.directive';
import { MyFavoritesComponent } from './components/my-favorites/my-favorites.component';
import { FavoritosService } from './services/favoritos.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    CreateAccountComponent,
    SearchComponent,
    PageNotFoundComponent,
    ProductDetailComponent,
    VerifyAccountComponent,
    CreateProductComponent,
    MustMatchDirective,
    TerminosYCondicionesComponent,
    FormatoFechaPipe,
    CustomCurrencyPipe,
    MyOffersComponent,
    MyProfileComponent,
    MyFavoritesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    NiceSelectModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AngularFirestore,
    UsuariosService,
    ProductosService,
    CategoriasService,
    OfertasService,
    FavoritosService,
    AuthService,
    CanActivateViaAuth,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
