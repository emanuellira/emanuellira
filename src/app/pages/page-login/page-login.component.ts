/** [# version: 7.4.8 #] */

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LoginForm } from '../../directives/page-login/form.controls';
import { AlertsService } from 'src/app/services/alerts.service';
import { LoginService } from 'src/app/services/login.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { IPaths } from 'src/app/class/interfaces/path.interface';
import { environment } from 'src/environments/environment';
import { DownloadService } from 'src/app/services/download.service';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.css'],
})
export class PageLoginComponent implements OnInit {
  //#region [Propiedades]: Name->
  formLogin: FormGroup;
  modulo: string = '';
  lang_is_ready: boolean = false;
  language!: iModuleLang;
  //#endregion

  //#region [OnInit]: Name-> constructor - ngOnInit
  constructor(
    private _fb_: FormBuilder,
    private _alert_: AlertsService,
    private _login_: LoginService,
    private _navigate_: NavigationService,
    private _download_: DownloadService,
    private _lang_: LangService
  ) {
    this.formLogin = this._fb_.group({});
  }

  ngOnInit(): void {
    this.modulo = this._login_.Define_modulo('login');
    this._download_.Get_Json_Lang('lang', '').subscribe(
      (lang) => {
        this._lang_.language = lang;
        this._lang_.modulo = 'login';
        this.language = this._lang_.language_by_modulo;

        this.lang_is_ready = true;
        this.crearFormulario();
      },
      (err) => console.error(err)
    );
  }
  //#endregion

  /**
   * @name crearFormulario
   * @todo:
   *    > Utiliza FormBuilder para crear el form reactivo del login.
   *    > Utiliza {@link directives/page-login/form.controls.ts} para cada
   *        control.
   *    > Utiliza {@link directives/form-error.directive.ts} para generar el
   *        mensaje de error en el form
   *    > Utiliza {@link directives/custom-validators/...} para control de
   *        errores: Estos se deben crear para cada tipo de error
   *
   * @description:
   *    Usar este ejemplo para cada form que utilice el proyecto
   */
  //#region [Function]: Name-> Crear formulario
  crearFormulario = () => {
    this.formLogin = this._fb_.group({
      txtLoginNombre: LoginForm.txtLoginNombre([this.language.form_error_1]),
      txtLoginPassword: LoginForm.txtLoginPassword([this.language.form_error_2]),
    });
    const usuario_data = window.localStorage.getItem('usuario');
    const str_auto_login_date = window.localStorage.getItem('auto_login_date');
    const auto_login_date = new Date(str_auto_login_date || '');
    const dif = new Date().getTime() - auto_login_date.getTime();
    // console.log(dif / 1000 / 60);
    const now = Math.round(dif / 1000 / 60) || 0;
    if (!environment.production) {
      if (usuario_data && now < 360) {
        const usuario = JSON.parse(usuario_data);
        this._navigate_.Next_View = this._login_.Set_Data_User(usuario);
        // console.log(usuario);
      } else {
        window.localStorage.removeItem('usuario');
        window.localStorage.removeItem('auto_login_date');
        window.localStorage.setItem('auto_login_date', new Date().toString());
      }
      // console.log(
      //   `Tiempo para caducar sesión: %c${360 - now}mins`,
      //   `color:cyan; font-style:bold;`
      // );
    }
  };
  //#endregion

  /**
   * @name Login
   * Mostrar la siguiente vista dependiendo del usuario:
   *  > Admin: Options -> Revisión, Eventos, Usuarios
   *  > Normativo: Eventos[Consulta] -> Revisión
   *  > Captura: Revisión
   *  > Captura [Caducado]: Revisión Consulta
   *  > Normativo [Captura no Caducado]: Options -> Revision Consulta
   *  > AdminB: Igual a Admin pero en modo consulta
   */
  //#region [Function]: Name-> Login
  Login = () => {
    if (this.formLogin.valid) {
      this._alert_.SetLoading = this.language.iniciando_sesion;
      this._login_
        .Login(this.txtLoginNombre.value, this.txtLoginPassword.value)
        .subscribe(
          (p: IPaths) => (this._navigate_.Next_View = p),
          (err: any) => {
            // Warning-> Capturar el error
            // this._alert_.FireToast(err.error.Message ?? 'No se pudo realizar la conexión', 'error');
            this._alert_.Close();
            this._alert_.FireToastOwn(
              err.error.Message ?? this.language.no_se_pudo_realizar_conexion,
              'danger',
              'times-circle',
              5000
            );
            console.error(err);
          }
        );
    } else {
      // Más adelante hay que sustituir por nuestros propios alerts basados en
      // bootstrap 5
      // this._alert_.Show('danger', 'Existen errores en el formulario', 'times');
      this._alert_.FireToastOwn(
        this.language.errores_formulario,
        'danger',
        'times-circle',
        5000
      );
      // this._alert_.FireToast('Existen errores en el formulario', 'error');
    }
  };
  //#endregion

  //#region [Getters]: Name-> Nombre, Password
  get txtLoginNombre() {
    return <FormControl>this.formLogin.get('txtLoginNombre');
  }

  get txtLoginPassword() {
    return <FormControl>this.formLogin.get('txtLoginPassword');
  }
  //#endregion
}
