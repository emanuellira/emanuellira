/** [# version: 6.3.2 #] */
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { IConfig } from '../class/interfaces/config.interface';
import * as configdebug from '../../assets/config/debug.json';
import * as configprod from '../../assets/config/prod.json';

@Pipe({
  name: 'domseguro',
})
export class DomseguroPipe implements PipeTransform {

  config: IConfig = {};

  constructor(private _dom_: DomSanitizer) {
    if (environment.production) {
      this.config = {
        ...configprod.config,
      };
    } else {
      this.config = {
        ...configdebug.config,
      };
    }
  }

  transform(value: string, ...args: string[]): SafeResourceUrl {
    const folder = args[0] || '';
    const url = `${this.config.imagenes}/${folder}/${value}`;

    return this._dom_.bypassSecurityTrustResourceUrl(url);
  }
}
