import { Oferta } from './oferta';

export class Producto {
    id: number;
    categoria: number = -1;
    nombre: string;
    descripcion: string;
    fechaInicio: string;
    fechaFin: string;
    precio: number;
    imagenes: Array<string>;
    ofertas: Array<any>;

    precioAntiguo: number;
    precioNuevo: number;
}
