/** [# version: 7.5.17 #] */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IUsuario } from '../class/interfaces/usuario.interface';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IConfig } from '../class/interfaces/config.interface';
import * as configdebug from '../../assets/config/debug.json';
import * as configprod from '../../assets/config/prod.json';
import { PATH_, TIPOS_, _MODULOS_AYUDA_ } from '../global/globals';
import { IPaths } from '../class/interfaces/path.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService implements IUsuario {
  //#region [Propiedades]:
  Tipo = '';
  IDUsuario = 0;
  IDUsuario_Captura = 0;
  IDEvento = 0;
  IDEvento_Captura: number = 0;
  Token = '';
  EstaLogeado = false;
  config: IConfig = {};
  EsUsuarioSoloLectura = false;
  NomUsuario = '';
  NomSector = '';
  FechaExpira = new Date();
  Sector: number = 0;
  Sector_Captura: number = 0;
  Nivel: string | undefined;
  Caducado: boolean = false;
  Caducado_Captura: boolean = false;
  FechaExpira_Captura: Date = new Date();
  //#endregion

  //#region [constructor]:
  /**
   * @description
   * El constructor pregunta el ambiente y en base a ello solicita la
   * información de configuración. Esto es para poder mover la aplicación
   * sin necesidad de re-compilar
   * @param _http_
   */
  constructor(private _http_: HttpClient) {
    if (environment.production) {
      this.config = { ...configprod.config };
    } else {
      this.config = { ...configdebug.config };
    }

    console.log('Revisando configuración:', this.config);
  }
  //#endregion

  //#region [Getters]: Name-> Get 3 API
  /**
   * @name Get_3_API
   * @param _controller_ recibe el nombre del controlador de la api3 y crea
   * la ruta para el request
   */
  private Get_3_API = (_controller_: string) =>
    `${this.config.Uri3}/${_controller_}`;

  Get_Tipo = () => this.Tipo.split('_')[0];
  Get_Tipo_By_Item = (_tipo_: string) =>
    _tipo_ ? _tipo_.split('_')[0] === 'Captura' : '';
  //#endregion

  //#region [Function]: Name-> Login
  /**
   * @name Login
   * @description Realiza el post enviando la data como json, el pipe permite
   *    tratar los datos antes de ser enviados al método que solicita el resultado.
   * @param _usuario_ cuenta de usuario
   * @param _password_ password de usuario
   */
  Login = (_usuario_: string, _password_: string): Observable<IPaths> => {
    const body = { NomUsuario: _usuario_, Password: _password_ };

    return this._http_
      .post<IUsuario>(this.Get_3_API('Login'), body)
      .pipe(map((usuario) => this.Set_Data_User(usuario)));
  };

  //#endregion

  //#region [Function]: Name-> Cerrar Sesión
  /**
   * @name Log_Off
   * @description Disminuye en 1 el número de sesiones del usuario.
   */
  Log_Off = () => {
    const body = { IDUsuario: this.IDUsuario };
    return this._http_.post(this.Get_3_API('Login/CloseSession'), body).pipe(
      map(() => {
        this.EstaLogeado = false;
      })
    );
  };
  //#endregion

  //#region [Function]: Name-> Revisar Nivel
  Has = (clave: string) =>
    this.Nivel === '*' || this.Nivel?.split(',').find((c) => c === clave);

  //#endregion

  //#region [Function]: Name-> Set Data User
  public Set_Data_User(usuario: IUsuario): any {
    const views_dictionary: { [index: string]: any } = {
      [TIPOS_.Captura]: PATH_._REVISION_,
      [TIPOS_.Administrador]: PATH_._OPTIONS_,
      [TIPOS_.AdministradorB]: PATH_._EVENTOS_,
      [TIPOS_.Normativo]: PATH_._EVENTOS_,
    };
    this.EstaLogeado = true;
    this.IDUsuario = usuario.IDUsuario;
    this.IDUsuario_Captura = usuario.IDUsuario;
    this.IDEvento = Number(usuario.IDEvento);
    this.IDEvento_Captura = Number(usuario.IDEvento);
    this.Tipo = usuario.Tipo;
    this.Token = usuario.Token;
    this.NomUsuario = String(usuario.NomUsuario);
    this.NomSector = String(usuario.NomSector);
    this.Sector = Number(usuario.Sector);
    this.Sector_Captura = Number(usuario.Sector);
    this.FechaExpira = new Date(String(usuario.FechaExpira));
    this.FechaExpira_Captura = new Date(String(usuario.FechaExpira));
    this.Nivel = usuario.Nivel;
    this.Caducado = this.Revisar_Caducidad(this.FechaExpira);
    this.Caducado_Captura = this.Revisar_Caducidad(this.FechaExpira);

    if (!environment.production) {
      window.localStorage.setItem('usuario', JSON.stringify(usuario));
    }
    const tipo = this.Tipo.split('_')[0];

    return { path: views_dictionary[tipo] };
  }
  //#endregion

  //#region [Function]: Name-> Revisar Caducidad y Usuario
  Revisar_Caducidad = (fecha: Date) => new Date() > fecha;

  Revisar_Usuario = (_tipo_: string, _estatus_: string) => {
    /* 
      Captura = Cuando está caducado
      Normativo = Cuando el de Captura No está caducado, 
      Administrador = No caduca
      y AdministradorB = Siempre es solo lectura
       */
    this.EsUsuarioSoloLectura =
      this.Caducado_Captura || this.Tipo === TIPOS_.AdministradorB;
    // console.log(this.Caducado_Captura);

    if (_tipo_ === 'Normativo') {
      const estatus = _estatus_.split('|');
      this.EsUsuarioSoloLectura =
        estatus.indexOf(this.Sector.toString()) >= 0 || !this.Caducado_Captura;
      // console.log(this.EsUsuarioSoloLectura);
    }
    // console.log(this.EsUsuarioSoloLectura);
  };
  //#endregion

  //#region [Function]: Name-> Define modulo
  Define_modulo = (modulo: string): string => {
    const m = _MODULOS_AYUDA_.find(
      (f) => f.id === `${this.Get_Tipo()}__${modulo}`
    );
    return m ? m.nombre : '';
  };
  //#endregion
}
