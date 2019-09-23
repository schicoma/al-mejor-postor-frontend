import { Oferta } from './oferta';

export class Producto {
    uid: string;
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

    usuarioGanador: any;
    usuarioCalificado: boolean;

    keywords: Array<string>;
    fechaCreacion: any;
}
