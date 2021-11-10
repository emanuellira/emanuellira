/** [# version: 7.5.34 #] */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import * as configdebug from '../../assets/config/debug.json';
import * as configprod from '../../assets/config/prod.json';

import { IConfig, IDateSplit } from '../class/interfaces/config.interface';
import { IEvento } from '../class/interfaces/evento.interface';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { IAccion, IActivo, IDiags } from '../class/interfaces/diags.interface';
import {
  ICatalogo,
  IDivAdmin2,
  IDivAdmin3,
  ISectores,
} from '../class/interfaces/catalogo.interface';
import { IMenu } from '../class/interfaces/menu.interface';
import { IUsuario } from '../class/interfaces/usuario.interface';
import { IResultado } from '../class/interfaces/resultado.interface';
import { HayError } from '../class/hay-error';
import { IData, IEntrevista } from '../class/interfaces/plantilla.interface';
import { IPerfiles } from '../class/interfaces/perfiles.interface';
import { LangService } from './lang.service';

@Injectable({
  providedIn: 'root',
})
export class DbapiService {
  //#region [Propiedades]: Name->
  config: IConfig = {};
  btn_items_group: Array<Array<IMenu>> = [];
  //#endregion

  //#region [Constructor]:
  constructor(private _http_: HttpClient, private _lang_: LangService) {
    this.config = { ...configdebug.config };
    if (environment.production) this.config = { ...configprod.config };
  }
  //#endregion

  //#region [Getters]: Name-> Get 3 API, GET and POST, Simb Moneda
  /**
   * @name Get_3_API
   * @param _controller_ recibe el nombre del controlador de la api3 y crea
   * la ruta para el request
   */
  private Get_3_API = (_controller_: string) =>
    `${this.config.Uri3}/${_controller_}`;

  get Simb_Moneda() {
    return this.config.sim_moneda;
  }
  //#endregion

  //#region [Function]: Name-> GET Evento, Save Evento, Autorizar Evento
  /**
   * @name Get_Evento
   * @param _idevento_ El id que relaciona al usuario con el evento. También
   *    puede recibir el id del evento seleccionado
   * @returns los datos del evento de acuerdo a {@link IEvento}
   */
  Get_Evento = (_idevento_: number): Observable<IEvento> =>
    this._http_
      .get<IEvento>(this.Get_3_API(`Eventos/${_idevento_}`))
      .pipe(map((evento) => evento));
  /**
   * @name Get_Eventos
   * @returns la lista de eventos
   */
  Get_Eventos = (): Observable<Array<IDiags>> =>
    this._http_
      .get<Array<IDiags>>(this.Get_3_API(`Eventos`))
      .pipe(map((eventos) => eventos));
  /**
   *
   * @param _evento_ evento que va a ser actualizado o insertado
   * @returns el resultado desde la api
   */
  Save_Evento = (_evento_: IEvento): Observable<IResultado> => {
    const body = _evento_;
    return this._http_
      .post<IResultado>(this.Get_3_API(`Eventos`), body)
      .pipe(map((resultado) => resultado));
  };
  /**
   * @description El evento manda el sector y la api lo agrega a la
   * lista
   * @param _evento_ Evento a autorizar
   * @returns
   */
  Autorizar_Evento = (_evento_: IEvento): Observable<IResultado> => {
    const body = _evento_;
    return this._http_
      .post<IResultado>(this.Get_3_API(`Eventos/Autorizar`), body)
      .pipe(map((resultado) => resultado));
  };
  Evento_Autorizado = (_estatus_: string, _id_evento_: number) => {
    const autorizados = _estatus_.split('|');
    return autorizados.some((f) => f === String(_id_evento_));
  };
  //#endregion

  //#region [Function]: Name-> Get_Reportes
  /**
   * @name Get_Reportes
   * @returns imprime el reporte
   */
  Get_Reportes = (
    _tipo_doc_: string,
    _descripcion_: string,
    _id_usuario_: number,
    _id_sector_: number,
    _id_evento_: number,
    _firmas_: Array<string>
  ): Observable<IResultado> => {
    const body = {
      Tipo_Doc: _tipo_doc_,
      Descripcion: _descripcion_,
      IDUsuario: _id_usuario_,
      IDSector: _id_sector_,
      IDEvento: _id_evento_,
      Firmas: _firmas_,
      Url: this.config.pais_reporte,
      SSL: this.config.ssl,
      Abr: this.config.pais_abrv,
      Culture: this.config.culture,
      Debug: !environment.production,
    };
    // console.log(body);
    return this._http_
      .post<IResultado>(this.Get_3_API(`Reportes`), body)
      .pipe(map((resultado) => resultado));
  };
  //#endregion

  //#region [Function]: Name-> Indicadores
  Get_Indicador = (_id_usuario_: number, _tipo_: string, _filtro_: number) => {
    const body = { ID: _id_usuario_, IDAccion: _filtro_ };
    return this._http_
      .post<Array<IResultado>>(this.Get_3_API(`Indicadores/${_tipo_}`), body)
      .pipe(map((resultado) => resultado));
  };
  //#endregion

  //#region [Function]: Name-> GET Usuarios, Save, Get Usuario x Evento
  /**
   * @name Get_Usuarios
   * *@param _idusuario_ El id que relaciona al evento con el usuario. También
   *    puede recibir el id del usuario seleccionado
   * @returns los datos del usuario de acuerdo a {@link IUsuario}
   */
  Get_Usuario = (_idusuario_: number): Observable<Array<IDiags>> =>
    this._http_
      .get<Array<IDiags>>(this.Get_3_API(`Usuarios/${_idusuario_}`))
      .pipe(map((usuario) => usuario));

  Save_Usuario = (_usuario_: IDiags): Observable<IResultado> => {
    const body = {
      IDUsuario: Number(_usuario_.IDUsuario),
      IDEvento: Number(_usuario_.IDEvento),
      IDPerfil: Number(_usuario_.IDPerfil),
      Nombre: _usuario_.Nombre || '',
      Apellidos: _usuario_.Apellidos || '',
      NomUsuario: _usuario_.NomUsuario,
      Password: _usuario_.Password,
      Sesiones: _usuario_.Sesiones,
      LimiteSesiones: Number(_usuario_.LimiteSesiones),
      FechaExpira: new Date(_usuario_.FechaExpira),
      Sector: _usuario_.Sector,
      Telefono: _usuario_.Telefono || '',
      Correo: _usuario_.Correo || '',
      Cargo: _usuario_.Cargo || '',
      Token: '',
      IDProvincia: Number(_usuario_.IDProvincia),
    };
    return this._http_
      .post<IResultado>(this.Get_3_API(`Usuarios/Guardar`), body)
      .pipe(map((resultado) => resultado));
  };

  Get_Usuario_X_Evento = (
    _id_evento_: number,
    _sector_: number
  ): Observable<IUsuario> =>
    this._http_
      .get<IUsuario>(
        this.Get_3_API(`Usuarios/Evento/${_id_evento_}/${_sector_}`)
      )
      .pipe(map((usuario) => usuario));

  Delete_Usuario = (_id_: number) =>
    this._http_
      .get<IResultado>(this.Get_3_API(`Usuarios/Delete/${_id_}`))
      .pipe(map((resultado) => resultado));

  //#endregion

  //#region [Function]: Name-> Get Capturas
  /**
   * @name Get_Capturas
   * @param _idevento_ id relacionado con el evento ya sea del usuario o del evento seleccionado
   * @param _tipo_ el tipo de usuario sirve para obtener lo datos preliminares o definitivos
   * @returns una lista de diagnosticos
   */
  Get_Capturas = (
    _idevento_: number,
    _tipo_: string
  ): Observable<Array<IDiags>> => {
    const body = { IDUsuario: _idevento_, Tipo: _tipo_ };
    return this._http_
      .post<Array<IDiags>>(this.Get_3_API('Capturas'), body)
      .pipe(map((diags) => diags));
  };
  //#endregion

  //#region [Function]: Name-> Get Entrevistado
  /**
   * @name Get_Entrevistado
   * @param _id_activo_
   * @param _tipo_ el tipo de usuario sirve para obtener lo datos preliminares o definitivos
   * @returns una lista de diagnosticos
   */
  Get_Entrevistado = (_id_activo_: number): Observable<IEntrevista> =>
    this._http_
      .get<IEntrevista>(
        this.Get_3_API(`Capturas/DatosEntrevista/${_id_activo_}`)
      )
      .pipe(map((entrevistado) => entrevistado));
  //#endregion

  //#region [Function]: Name-> Delete_Captura
  /**
   * @name Delete_Captura
   * @param _id_accion_ el id del daño a eliminar
   * @param _tipo_ el tipo de usuario que lo solicita para determinar la tabla de
   * donde se eliminaría el registro
   * @returns un string con la información del request
   */
  Delete_Captura = (
    _id_accion_: number,
    _tipo_: string
  ): Observable<IResultado> => {
    const body = { Tipo: _tipo_, IDAccion: _id_accion_ };
    return this._http_
      .post<IResultado>(this.Get_3_API('Capturas/Eliminar'), body)
      .pipe(map((result) => result));
  };
  //#endregion

  //#region [Function]: Name-> Save_Activo
  /**
   * @name Save_Activo
   * @param _activo_ el activo completo del daño a guardar
   * @param _tipo_ el tipo de usuario que lo solicita para determinar la tabla de
   * donde se guardará el registro
   * @returns un string con la información del request
   */
  Save_Activo = (_activo_: IActivo, _tipo_: string): Observable<IActivo> => {
    const body = _activo_;
    return this._http_
      .post<IActivo>(this.Get_3_API(`Capturas/GuardarActivo/${_tipo_}`), body)
      .pipe(map((result) => result));
  };
  //#endregion

  //#region [Function]: Name-> Save_Accion
  /**
   * @name Save_Accion
   * @param _id_accion_ el id del daño a guardar
   * @param _tipo_ el tipo de usuario que lo solicita para determinar la tabla de
   * donde se guardará el registro
   * @returns un string con la información del request
   */
  Save_Accion = (_accion_: IAccion, _tipo_: string): Observable<IAccion> => {
    const body = _accion_;
    return this._http_
      .post<IAccion>(this.Get_3_API(`Capturas/GuardarAccion/${_tipo_}`), body)
      .pipe(map((result) => result));
  };
  //#endregion

  //#region [Function]: Name-> Catálogos
  /**
   * @name Get_Catalogos
   * @param _id_sector_ Identificador del sector
   * @returns Lista de catálogos
   */
  Get_Catalogos = (_id_sector_: number): Observable<Array<ICatalogo>> =>
    this._http_
      .get<Array<ICatalogo>>(this.Get_3_API(`Catalogos/${_id_sector_}`))
      .pipe(map((catalogos) => catalogos));

  Get_Departamentos = (): Observable<Array<IDivAdmin2>> => {
    return this._http_
      .get<Array<IDivAdmin2>>(this.Get_3_API(`Catalogos/Div_Admin2`))
      .pipe(map((departamentos) => departamentos));
  };

  Get_Municipios = (_id_divamin2_: number): Observable<Array<IDivAdmin3>> => {
    return this._http_
      .get<Array<IDivAdmin3>>(
        this.Get_3_API(`Catalogos/Div_Admin3/${_id_divamin2_}`)
      )
      .pipe(map((municipios) => municipios));
  };
  //#endregion

  //#region [Function]: Name-> Get_Reportes_Filtro
  /**
   * @name Get_Reportes
   * @returns imprime el reporte
   */
  Get_Reportes_Filtro = (
    _tipo_doc_: string,
    _descripcion_: string,
    _id_usuario_: number,
    _id_sector_: number,
    _id_evento_: number,
    _firmas_: Array<string>
  ): Observable<IResultado> => {
    const body = {
      Tipo_Doc: _tipo_doc_,
      Descripcion: _descripcion_,
      IDUsuario: _id_usuario_,
      IDSector: _id_sector_,
      IDEvento: _id_evento_,
      Firmas: _firmas_,
      Url: this.config.pais_reporte,
      SSL: this.config.ssl,
      Abr: this.config.pais_abrv,
      Culture: this.config.culture,
      Debug: !environment.production,
    };
    // console.log(body);
    return this._http_
      .post<IResultado>(this.Get_3_API(`Reportes/Filtro`), body)
      .pipe(map((resultado) => resultado));
  };
  //#endregion

  Get_Sectores = (): Observable<Array<ISectores>> => {
    return this._http_
      .get<Array<ISectores>>(this.Get_3_API(`Catalogos/Sectores`))
      .pipe(map((sectores) => sectores));
  };

  Get_Perfiles = (): Observable<Array<IPerfiles>> =>
    this._http_
      .get<Array<IPerfiles>>(this.Get_3_API(`Catalogos/Perfiles`))
      .pipe(map((perfiles) => perfiles));

  Get_Update_Ver_Cat_ = (idSector: number): Observable<IResultado> =>
    this._http_
      .get<IResultado>(this.Get_3_API(`Catalogos/UpdateVersion/${idSector}`))
      .pipe(map((resultado) => resultado));

  //#region [Function]: Name-> Catalogos_Insert
  /**
   * @name Catalogos_Insert
   * @returns imprime el reporte
   */
  Catalogos_Insert = (
    _tipo_doc_: string,
    _descripcion_: string,
    _id_usuario_: number,
    _id_sector_: number,
    _id_evento_: number,
    _firmas_: Array<string>
  ): Observable<IResultado> => {
    const body = {
      Tipo_Doc: _tipo_doc_,
      Descripcion: _descripcion_,
      IDUsuario: _id_usuario_,
      IDSector: _id_sector_,
      IDEvento: _id_evento_,
      Firmas: _firmas_,
      Url: this.config.pais_reporte,
      SSL: this.config.ssl,
      Abr: this.config.pais_abrv,
      Culture: this.config.culture,
      Debug: !environment.production,
    };
    // console.log(body);
    return this._http_
      .post<IResultado>(this.Get_3_API(`Catalogos/Insert`), body)
      .pipe(
        map((resultado) => {
          return resultado;
        })
      );
  };
  //#endregion

  //#region [Function]: Name-> Mostrar u ocultar botones de edición

  public Btns_Edition(_id_accion_: number) {
    const btns = this.btn_items_group.filter((g) => g[0].id === _id_accion_)[0];
    btns.map((b) => (b.visible = !b.visible));
  }

  public Set_Btns_Edition_ID(_id_accion_: number) {
    const btns = this.btn_items_group.filter((g) => g[0].id === 0)[0];
    if (btns) {
      btns.map((b) => {
        b.id = _id_accion_;
        // b.visible = !b.visible;
      });
    }
  }
  //#endregion

  //#region [Function]: Name-> Get_Date
  /**
   * @description Recibe una fecha en date o string y le da formato similar a: 'yyyy-mm-ddThh:mm:ss'
   * @param date fecha a la que se le dará formato
   * @returns
   */
  public Get_Date = (date: Date | string): string => {
    let f: IDateSplit = this.Split_Date(
      typeof date === 'string' ? new Date(date) : date
    );
    return `${f.y}-${f.m}-${f.d}T${f.h}:${f.min}:00`;
  };
  //#endregion

  //#region [Function]: Name-> Get_New_Date
  /**
   * @description Recibe una fecha en date o string y se le suman 20 días y le da formato similar a: 'yyyy-mm-ddThh:mm:ss'
   * @param date fecha a la que se le dará formato
   * @returns
   */
  public Set_Expiration_Date = (date: Date | string, dias: number): string => {
    let f = typeof date === 'string' ? new Date(date) : date;
    let i = 0;
    while (i < dias) {
      const _day_week_ = f.getDay();
      if (_day_week_ !== 0 && _day_week_ !== 6) {
        i++;
      }
      f.setDate(f.getDate() + 1);
    }
    let f2: IDateSplit = this.Split_Date(f);
    return `${f2.y}-${f2.m}-${f2.d}T${f2.h}:${f2.min}:00`;
  };
  private Split_Date = (f: Date): IDateSplit => {
    let ds: IDateSplit = {};
    ds.m = `0${f.getMonth() + 1}`;
    ds.m = ds.m.substr(ds.m.length - 2, 2);
    ds.d = `0${f.getDate()}`;
    ds.d = ds.d.substr(ds.d.length - 2, 2);
    ds.h = `0${f.getHours()}`;
    ds.h = ds.h.substr(ds.h.length - 2, 2);
    ds.min = `0${f.getMinutes()}`;
    ds.min = ds.min.substr(ds.min.length - 2, 2);
    ds.y = `${f.getFullYear()}`;
    return ds;
  };
  //#endregion

  //#region [Function]: Name-> Generate_Password
  /**
   * @description Recibe un password aleatorio cada vez que va a agregar un nuevo con longitud del tamaño de n
   * @param n longitud de la contraseña aleatoria
   * @returns
   */
  public Generate_Password = (n: number | string): string => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.!_';
    //const charactersLength = characters.length;
    for (let i = 0; i < n; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  };
  //#endregion

  //#region [Function]: Name-> Validar Datos
  Validar_Datos = (data: Array<IData>, modulo: string): HayError => {
    let valido: HayError = new HayError();
    this._lang_.modulo = 'hay_error';
    valido.language = this._lang_.language_by_modulo;
    // console.log(this._lang_.language_by_modulo);
    for (const item of data) {
      //Revisar si es editable
      if (item.editable && item.required) {
        const hayError: HayError = new HayError();
        hayError.language = this._lang_.language_by_modulo;
        switch (item.tipo) {
          case 'text':
          case 'textArea':
          case 'lista':
            if (
              item.formato &&
              (item.formato === 'number' || item.formato === 'money')
            ) {
              valido = hayError.Evalua_Number(item);
            } else {
              valido = hayError.Evalua_Text(item);
              // console.log('text:', item);
            }

            break;
          case 'date':
            valido = hayError.Evalua_Date(item);
            // console.log('date:', item);
            break;

          default:
            break;
        }

        if (valido.Hay_Error) return valido;
      }
    }
    return valido;
  };
  //#endregion

  //#region [Function]: Name-> Generate_Password
  /**
   * @description Recibe un password aleatorio cada vez que va a agregar un nuevo con longitud del tamaño de n
   * @param n longitud de la contraseña aleatoria
   * @returns
   */
  public Unlock_User = (_usuario_: IDiags) => {
    const body = {
      IDUsuario: Number(_usuario_.IDUsuario),
      IDEvento: Number(_usuario_.IDEvento),
      IDPerfil: Number(_usuario_.Tipo),
      Nombre: _usuario_.Nombre || '',
      Apellidos: _usuario_.Apellidos || '',
      NomUsuario: _usuario_.NomUsuario,
      Password: _usuario_.Password,
      Sesiones: _usuario_.Sesiones,
      LimiteSesiones: Number(_usuario_.LimiteSesiones),
      FechaExpira: new Date(_usuario_.FechaExpira),
      Sector: _usuario_.Sector,
      Telefono: _usuario_.Telefono || '',
      Correo: _usuario_.Correo || '',
      Cargo: _usuario_.Cargo || '',
      Token: '',
      IDProvincia: Number(_usuario_.IDProvincia),
    };
    return this._http_
      .post<IResultado>(this.Get_3_API(`Usuarios/UnlockUser`), body)
      .pipe(map((resultado) => resultado));
  };
  //#endregion
}
