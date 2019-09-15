import { Oferta } from './oferta';

export class Producto {
    id: number;
    categoria: number = -1;
    nombre: string;
    descripcion: string;
    fechaInicio: any;
    fechaFin: any;
    precio: number;
    imagenes: Array<string>;
    ofertas: Array<any>;
    estado: string;

    precioAntiguo: number;
    precioNuevo: number;

    keywords: Array<string>;
    fechaCreacion: any;
}
