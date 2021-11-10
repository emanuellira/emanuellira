import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IConfig } from '../class/interfaces/config.interface';

import * as configdebug from '../../assets/config/debug.json';
import * as configprod from '../../assets/config/prod.json';
import { map } from 'rxjs/operators';
import { IResultado } from '../class/interfaces/resultado.interface';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  config: IConfig = {};

  //#region [Constructor]:
  constructor(private _http_: HttpClient) {
    if (environment.production) {
      this.config = {
        ...configprod.config,
      };
    } else {
      this.config = {
        ...configdebug.config,
      };
      
    }
    console.log(this.config);
  }
  //#endregion

  //#region [Getters]: Name-> Get 3 API, GET and POST
  /**
   * @name Get_3_API
   * @param _controller_ recibe el nombre del controlador de la api3 y crea
   * la ruta para el request
   */
  private Get_3_API = (_controller_: string) =>
    `${this.config.Uri3}/${_controller_}`;
  //#endregion

  Upload = (
    _file_: File,
    _file_name_: string,
    _url_: string
  ): Observable<IResultado> => {
    const formData: FormData = new FormData();
    formData.append('File', _file_);
    formData.append('fileName', _file_name_);
    formData.append('url', _url_);
    formData.append('Debug',String(!environment.production));

    return this._http_
      .post<any>(this.Get_3_API('upload'), formData)
      .pipe(map((resultado) => resultado));
  };

  
}
