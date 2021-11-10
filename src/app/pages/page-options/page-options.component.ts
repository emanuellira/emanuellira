/** [# version: 6.0.3 #] */
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { IMenu } from 'src/app/class/interfaces/menu.interface';
import { BvsuiteCreateFilterComponent } from 'src/app/components/shared/Biblioteca/bvsuite-create-filter/bvsuite-create-filter.component';
import { PATH_, TIPOS_ } from 'src/app/global/globals';
import { AlertsService } from 'src/app/services/alerts.service';
import { LangService } from 'src/app/services/lang.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-page-options',
  templateUrl: './page-options.component.html',
  styleUrls: ['./page-options.component.css'],
})
export class PageOptionsComponent implements OnInit {
  //#region [Propiedades]:
  Menus: Array<IMenu> = [];
  modulo: string = '';
  menu_items: Array<IMenu> = [];

  // @ts-ignore
  @ViewChild(BvsuiteCreateFilterComponent) filter: BvsuiteCreateFilterComponent;
  language!: iModuleLang;
  //#endregion

  constructor(private _login_: LoginService, private _alert_: AlertsService,      private _lang_ : LangService) {}

  ngOnInit(): void {
    this.modulo = this._login_.Define_modulo('options');
    // Para activar el json de lenguaje:
        // ~1. EL módulo
        this._lang_.modulo = 'options';
        // ~2. La mima línea para cada módulo
        this.language = this._lang_.language_by_modulo;
    this.Crea_Menu();
  }

  /**
   * @name Crea_Menu
   * @description Ingresan 3 tipos de usuarios a ésta sección y les asigna opciones
   * dependiendo del tipo
   */
  public Crea_Menu() {
    const menus_dict: { [index: string]: any } = {
      [TIPOS_.Administrador]: [
        {
          label: this.language.ir_a_eventos,
          icon: 'icon-calendar-o',
          btn: '1',
          nav: PATH_._EVENTOS_,
        },
        {
          label: this.language.ir_a_usuarios,
          icon: 'icon-users',
          btn: '2',
          nav: PATH_._USUARIOS_,
        },
        {
          label: this.language.ir_a_catalogos,
          icon: 'icon-folder-open-o',
          btn: '1',
          nav: PATH_._CATALOGOS_,
        },
        {
          label: this.language.cerrar_sesion,
          icon: 'icon-power-off',
          btn: '3',
          nav: PATH_._CERRAR_SESION_,
        },
      ],
      [TIPOS_.AdministradorB]: [
        {
          label: this.language.ir_a_eventos,
          icon: 'icon-calendar-o',
          btn: '1',
          nav: PATH_._EVENTOS_,
        },
        {
          label: this.language.ir_a_usuarios,
          icon: 'icon-users',
          btn: '2',
          nav: PATH_._USUARIOS_,
        },
        {
          label: this.language.ir_a_catalogos,
          icon: 'icon-folder-open-o',
          btn: '1',
          nav: PATH_._CATALOGOS_,
        },
        {
          label: this.language.cerrar_sesion,
          icon: 'icon-power-off',
          btn: '3',
          nav: PATH_._CERRAR_SESION_,
        },
      ],
      [TIPOS_.Normativo]: [
        {
          label: this.language.ir_a_eventos,
          icon: 'icon-calendar-o',
          btn: '1',
          nav: PATH_._EVENTOS_,
        },
        {
          label: this.language.ir_a_catalogos,
          icon: 'icon-folder-open-o',
          btn: '2',
          nav: PATH_._CATALOGOS_,
        },
        {
          label: this.language.cerrar_sesion,
          icon: 'icon-power-off',
          btn: '3',
          nav: PATH_._CERRAR_SESION_,
        },
      ],
    };

    this.Menus = menus_dict[this._login_.Tipo];

    this._alert_.Close();
  }
}
