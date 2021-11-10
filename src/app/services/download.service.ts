// [# version: 6.4.16 #]
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IData, IPlantilla } from '../class/interfaces/plantilla.interface';
import { environment } from 'src/environments/environment';
import { IConfig } from '../class/interfaces/config.interface';

import * as configdebug from '../../assets/config/debug.json';
import * as configprod from '../../assets/config/prod.json';
import { IMenuJson, IMenusJson } from '../class/interfaces/menu.interface';
import { IAccion, IActivo } from '../class/interfaces/diags.interface';
import { IAyuda, IDataAyuda } from '../class/interfaces/ayuda.interface';
import { iLang } from '../class/interfaces/lang.interface';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
	//#region [Propiedades]: Name->
	config: IConfig = {};
	private _menaje_: number = 0;
	private _perdidas_: string = 'none';
	private _costo_adicional_: number = 0;
	private _entrevistaJson_: IData[] = [];
	private _capturistaJson_: IData[] = [];
	//#endregion

  //#region [contructor]
  constructor(private http: HttpClient) {
    if (environment.production) {
      this.config = { ...configprod.config };
    } else {
      this.config = { ...configdebug.config };
    }
  }
  //#endregion

	//#region [Getters]: Name-> Menaje
	get menaje() {
		return this._menaje_;
	}
	get EntrevistaJson() {
		return this._entrevistaJson_;
	}
	get CapturistaJson() {
		return this._capturistaJson_;
	}
	get has_menaje() {
		return this._menaje_ >= 0;
	}
	get perdidas() {
		return this._perdidas_;
	}
	get has_perdidas() {
		return this._perdidas_ !== '';
	}
	get costo_adicional() {
		return this._costo_adicional_;
	}
	get has_costo_adicional() {
		return this.costo_adicional >= 0;
	}
	//#endregion

  //#region [Function]: Name-> Get_Path_Json
  /**
   * @name Get_Path_Json
   * @description Genera la ruta para buscar el archivo y descargarlo
   * @param _file_name_ Nombre del archivo json a cargar
   * @param _folder_ Nombre de la carpeta donde se encuentra el archivo
   * @returns el path del archivo
   */
  Get_Path_Json(_file_name_: string, _folder_: string): string {
    return `${this.config.plantillas}/${_folder_}/${this.config.pais_abrv}/${_file_name_}.json`;
  }

  Get_Path_Json2(_file_name_: string, _folder_: string): string {
    return `${this.config.plantillas}/${_folder_}/${_file_name_}.json`;
  }

  //#endregion

	//#region [Function]: Name-> Get_Json_Plantillas
	/**
	 * @name Get_Json
	 * @description Lee el json del sector correspondiente, sin embargo, en la propiedad: editable
	 * se realiza una modificación, se cambia a tipo array por lo cual se requiere reconvertir el tipo
	 * de dato con el @method JSON.stringify y se obtiene el valor de la posición 1 con el
	 * @method JSON.parse. Todo esto debido a que la interface {@link plantilla.inteface.ts} tiene la propiedad: editable como boolean
	 * @returns la lista de encabezados
	 */
	Get_Json_Plantillas = (sector: number): Observable<Array<IData>> => {
		return this.http.get<IPlantilla>(this.Get_Path_Json(String(sector), 'plantillas')).pipe(
			map((file_json: IPlantilla) => {
				// console.log(file_json);
				this._entrevistaJson_ = file_json.entrevista;
				this._capturistaJson_ = file_json.capturista;
				this._menaje_ = file_json.sector.menaje || -1;
				this._perdidas_ = file_json.sector.perdidas || 'none';
				this._costo_adicional_ = file_json.sector.costo_adicional || -1;
				// console.log(this.perdidas);
				return file_json.data.map((h) => {
					if (h.editable) {
						let editable_aux = JSON.stringify(h.editable);
						h.editable = JSON.parse(editable_aux)[1];
						// console.log(h.editable);
					}
					return h;
				});
			})
		);
	};
	//#endregion

  //#region [Function]: Name-> Json Idioma
  /**
   * @description Obtiene el json del idioma
   * @returns El json con las propiedades del idioma
   */
  Get_Json_Lang = (_name_: string, _ruta_: string): Observable<iLang> => {
    return this.http
      .get<iLang>(this.Get_Path_Json2(_name_, _ruta_))
      .pipe(map((file_json: iLang) => file_json));
  };
  //#endregion

  //#region [Function]: Name-> Json Usuario
  /**
   * @description Obtiene las propiedades para limpiar y llenar los datos del usuario
   * @returns El json con las propiedades del ususario
   */
  Get_Json_Usuarios = (): Observable<IPlantilla> => {
    return this.http
      .get<IPlantilla>(this.Get_Path_Json2('usuarios', 'plantillas'))
      .pipe(map((file_json: IPlantilla) => file_json));
  };
  //#endregion

	//#region [Function]: Name-> Json Entrevista
	/**
	 * @description Obtiene las propiedades para limpiar y llenar los datos del entrevistado
	 * @returns El json con las propiedades del entrevistado
	 */
	Get_Json_Entrevistado = (): Observable<IPlantilla> => {
		return this.http
			.get<IPlantilla>(this.Get_Path_Json2('entrevistas', 'plantillas'))
			.pipe(map((file_json: IPlantilla) => file_json));
	};
	//#endregion

  //#region [Function]: Name-> Json Activo y Acción
  /**
   * @description Obtiene las propiedades para limpiar y llenar los datos del activo
   * @returns El json con las propiedades del activo
   */
  Get_Json_Activo = (): Observable<IActivo> => {
    return this.http
      .get<IActivo>(this.Get_Path_Json2('activo', 'plantillas'))
      .pipe(map((file_json: IActivo) => file_json));
  };
  //#endregion

  //#region
  /**
   * @description Obtiene las propiedades para limpiar y llenar los datos de la acción
   * @returns El json con las propiedades de la acción
   */
  Get_Json_Accion = (): Observable<IAccion> => {
    return this.http
      .get<IActivo>(this.Get_Path_Json2('accion', 'plantillas'))
      .pipe(map((file_json: IAccion) => file_json));
  };
  //#endregion

  //#region [Function]: Name-> Get_Json_Menus
  /**
   * @name Get_Json_Menus
   * @description Carga el archivo menu json correspondiente por país
   * @returns la lista de menus del navbar y de los botones
   */
  Get_Json_Menus = (_file_name_: string): Observable<IMenuJson> => {
    return this.http
      .get<IMenusJson>(this.Get_Path_Json(_file_name_, 'menus'))
      .pipe(map((file_json: IMenusJson) => file_json.menu));
  };
  //#endregion

  //#region [Function]: Name-> Json Ayuda
  /**
   * @description Obtiene las propiedades de los datos de la ayuda
   * @returns El json con las propiedades de la ayuda por módulo
   */
  Get_Json_Ayuda = (_modulo_: string): Observable<Array<IDataAyuda>> => {
    return this.http
      .get<IAyuda>(this.Get_Path_Json2('ayuda', 'ayuda'))
      .pipe(map((file_json: IAyuda) => file_json.data[_modulo_]));
  };
  //#endregion

  //#region [Function]: Name-> URL Ayuda
  /**
   * @description Obtiene la url donde se encuentra los recursos de ayuda (videos, pdf, etc)
   * @returns Retorna la URL de ayuda
   */
  Url_Ayuda() {
    return `${this.config.plantillas}/ayuda/`;
  }
  //#endregion
}
