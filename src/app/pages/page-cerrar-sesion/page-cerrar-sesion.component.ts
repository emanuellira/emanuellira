/** [# version: 7.1.2 #] */
import { Component, OnInit, ViewChild } from '@angular/core';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { BvsuiteCreateFilterComponent } from 'src/app/components/shared/Biblioteca/bvsuite-create-filter/bvsuite-create-filter.component';
import { AlertsService } from 'src/app/services/alerts.service';
import { LangService } from 'src/app/services/lang.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-page-cerrar-sesion',
  templateUrl: './page-cerrar-sesion.component.html',
  styleUrls: ['./page-cerrar-sesion.component.css'],
})
export class PageCerrarSesionComponent implements OnInit {
  modulo: string = '';
  // @ts-ignore
  @ViewChild(BvsuiteCreateFilterComponent) filter: BvsuiteCreateFilterComponent;
  language!: iModuleLang;
  constructor(
    private _login_: LoginService,
    private _alert_: AlertsService,
    private _lang_: LangService
  ) {}

  ngOnInit(): void {
    // console.log('Cerrar sesión');
    this.modulo = this._login_.Define_modulo('cerrar_sesion');
    // Para activar el json de lenguaje:
    // ~1. EL módulo
    this._lang_.modulo = 'cerrar_sesion';
    // ~2. La mima línea para cada módulo
    this.language = this._lang_.language_by_modulo;
    window.localStorage.removeItem('usuario');
    window.localStorage.removeItem('auto_login_date');
    this._login_.Log_Off().subscribe(
      (data) => {
        // Todo-> Tarea por hacer
        console.log('Sesión Cerrada');
        window.location.reload();
      },
      (err) => {
        // Warning-> Capturar el error
        this._alert_.FireToast(
          err.error.Message ?? this.language.no_se_pudo_realizar_conexion,
          'error'
        );
        console.log(err);
      }
    );
  }
}
