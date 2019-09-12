import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe

  ) {

  }
  transform(value: any, ...args: any[]): any {
    return 'S/ ' + this.decimalPipe.transform(value, '1.2-2');
  }

}
