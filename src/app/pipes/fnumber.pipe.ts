//[# version: 6.3.2 #]
import { Pipe, PipeTransform } from '@angular/core';
import { DbapiService } from '../services/dbapi.service';

@Pipe({
  name: 'fnumber',
})
export class FnumberPipe implements PipeTransform {
  constructor(private _db_api_: DbapiService) {}

  transform(value: string, ...args: unknown[]): string {
    let dato = '';
    const _formato_ = args[0];
    if (_formato_ === 'number') {
      dato = Number(value).toLocaleString();
    } else if (_formato_ === 'money') {
      dato = `${this._db_api_.Simb_Moneda} ${Number(value).toLocaleString()}`;
    } else {
      dato = value;
    }
    return dato;
  }
}
