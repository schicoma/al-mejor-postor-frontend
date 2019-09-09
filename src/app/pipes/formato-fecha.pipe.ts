import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatoFecha'
})
export class FormatoFechaPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return moment(value).format(args[0] || 'DD/MM/YYYY hh:mm:ss a');
  }

}
