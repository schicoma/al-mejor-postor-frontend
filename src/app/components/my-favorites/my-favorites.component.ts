import { Component, OnInit } from '@angular/core';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { AuthService } from 'src/app/services/core/auth.service';
import { take } from 'rxjs/operators';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ProductosService } from 'src/app/services/productos.service';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: ['./my-favorites.component.scss']
})
export class MyFavoritesComponent implements OnInit {

  mapaDeCategorias;
  favoritos: Array<any> = [];

  constructor(
    private usuarioService: UsuariosService,
    private authService: AuthService,
    private productosService: ProductosService,
    private categoriaService: CategoriasService
  ) { }

  ngOnInit() {

    this.categoriaService.obtenerMapaDeCategorias().subscribe(
      (data) => {
        this.mapaDeCategorias = data;
      }, () => {
      }, () => {
      }
    );

    if (this.authService.estaElUsuarioEnSesion()) {

      const usuarioEmail = this.authService.usuario.email;

      this.usuarioService.obtenerUsuarioByEmail(usuarioEmail).valueChanges().pipe(take(1))
        .subscribe((data: any) => {
          let favoritos = data.favoritos;
          let listaProductosFavoritos = [];

          if (favoritos) {
            for (let favorito of Object.keys(favoritos)) {
              if (favoritos[favorito]) {
                listaProductosFavoritos.push(favorito);
              }
            }

            if (listaProductosFavoritos) {
              this.productosService.listarProductosByUids(listaProductosFavoritos).pipe(take(1))
                .subscribe((data) => {
                  for (let producto of data) {
                    producto.subscribe((data) => {
                      this.favoritos.push(data.data());
                    });
                  }
                });
            }
          }
        });
    }
  }

  quitarDeMisFavoritos(productoUid, $index) {

    if (this.authService.estaElUsuarioEnSesion()) {
      let usuarioEmail = this.authService.usuario.email;

      this.usuarioService.obtenerUsuarioByEmail(usuarioEmail).valueChanges().pipe(take(1))
        .subscribe((data: any) => {
          if (data) {
            let favoritos = { ...data.favoritos };

            if (!favoritos) {
              favoritos = {};
            }

            let nuevosFavoritos = {};

            for (let producto of Object.keys(favoritos)) {
              if (favoritos[producto] && productoUid !== producto) {
                nuevosFavoritos[producto] = true;
              }
            }

            this.usuarioService.actualizarFavoritosFromUsuarioByDocId(data.email, nuevosFavoritos).then((data) => {

              this.favoritos.splice($index, 1);

            });
          }
        });
    }

  }
}
