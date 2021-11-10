//[# version: 6.4.2 #]
import { Component, OnInit } from '@angular/core';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { IMenu } from 'src/app/class/interfaces/menu.interface';
import { PATH_ } from 'src/app/global/globals';
import { AlertsService } from 'src/app/services/alerts.service';
import { DownloadService } from 'src/app/services/download.service';
import { LangService } from 'src/app/services/lang.service';
import { LoginService } from 'src/app/services/login.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-page-indicadores',
  templateUrl: './page-indicadores.component.html',
  styleUrls: ['./page-indicadores.component.css'],
})
export class PageIndicadoresComponent implements OnInit {
  //#region [Propiedades]:
  menu_items: Array<IMenu> = [];
  btns_items: Array<IMenu> = [];
  indicadores: Array<IMenu> = [];
  modulo: string = '';
  language!: iModuleLang;
  //#endregion

  //#region [OnInit]: Name-> constructor, ngOnInit
  constructor(
    private _alert_: AlertsService,
    private _navigate_: NavigationService,
    private _download_: DownloadService,
    private _login_: LoginService,
    private _lang_: LangService
  ) {}

  ngOnInit(): void {
    this.modulo = this._login_.Define_modulo('indicadores');
    this._lang_.modulo = 'indicadores';
    this.language = this._lang_.language_by_modulo;
    this.Crea_Menu();
  }
  //#endregion

  //#region [Function]: Name-> Item NavBar Clic
  /**
   *
   */
  //  Item_NavBar_Change = (_items_: Array<IDiags>) => {
  //   this.table.Change_Items(0, _items_);
  // };
  /**
   * @name Item_NavBar_Click
   * @param _item_name_ recibe el nombre del menú desde app-navbar o dynamic-table,
   * busca el item y si encuentra una coincidencia invoca el método correspondiente,
   * en caso contrario crea un IMenu e invoca a NoneEvent
   */
  Item_NavBar_Click = (args: Array<string>): void => {
    const _item_name_ = args[0];
    let func: IMenu | null =
      this.menu_items.find((f) => f.label === _item_name_) ?? null;
    if (func === null) {
      func = this.btns_items.find((f) => f.label === _item_name_) ?? {
        label: '',
        icon: '',
        btn: '',
        evento: this.NoneEvent,
      };
    }
    if (func.evento) func.evento(args);
  };
  //#endregion

  //#region [Function]: Name-> Actualizar
  Actualizar = () => {};
  //#endregion

  //#region [Function] Name-> Cerrar sesión y NoneEvent
  /**
   * @description Cierra la sesión redirigiendo al componente Cerrar sesión
   * @returns
   */
  /**
   * @name Cerrar_Sesión cierra la sesión actual
   */
  Cerrar_Sesion = (): void => {
    this._alert_
      .Confirm(this.language.cerrar_sesion)
      .then((choice: string) => {
        if (choice === 'ok') {
          this._navigate_.Next_View = { path: PATH_._CERRAR_SESION_ };
        }
      });
  };

  /**
   * @name Solo sirve para mostrar un mensaje por si el item no tiene
   *   relacionado un evento
   */
  NoneEvent = (): void => {
    this._alert_.ShowWait(this.language.item_no_relacionado_evento, '');
  };
  //#endregion

  //#region [Function]: Name-> Crea Menú
  /**
   * @name Crea_Menu
   * @description Crea el menú de la barra y solicita los datos del evento para
   * colocar la información en el header-info
   */
  Crea_Menu = () => {
    this._download_.Get_Json_Menus('indicadores').subscribe(
      (menu) => {
        // Todo-> Generar los menús
        // console.log(menu);
        this.menu_items = [
          {
            label: menu.nav[0].label,
            icon: menu.nav[0].icon,
            btn: menu.nav[0].btn,
            visible: menu.nav[0].visible,
            evento: this.Cerrar_Sesion,
          },
        ];
        this.indicadores = [
          {
            label: menu.indicadores[0].label,
            icon: menu.indicadores[0].icon,
            btn: menu.indicadores[0].btn,
            visible: menu.indicadores[0].visible,
            evento: this.Actualizar,
          },
          {
            label: menu.indicadores[1].label,
            icon: menu.indicadores[1].icon,
            btn: menu.indicadores[1].btn,
            visible: menu.indicadores[1].visible,
            evento: this.Actualizar,
          },
          {
            label: menu.indicadores[2].label,
            icon: menu.indicadores[2].icon,
            btn: menu.indicadores[2].btn,
            visible: menu.indicadores[2].visible,
            evento: this.Actualizar,
          },
          {
            label: menu.indicadores[3].label,
            icon: menu.indicadores[3].icon,
            btn: menu.indicadores[3].btn,
            visible: menu.indicadores[3].visible,
            evento: this.Actualizar,
          },
        ];
      },
      (err) => {
        // Warning-> Capturar el error
        console.log(err);
      }
    );
  };
  //#endregion

  //#region [Function]: Name-> Filter, Delete
  On_Filter_Chart = (args: any) => {
    // console.log(args);
    if (
      this.indicadores[args[1] + 1] &&
      !this.indicadores[args[1] + 1].visible
    ) {
      this.On_Delete_Chart([args[1]]);
    }
    this.indicadores.splice(args[1] + 1, 0, {
      label: args[2],
      btn: '',
      icon: '',
      visible: false,
      data: args[0],
    });
  };
  On_Delete_Chart = (args: any) => {
    this.indicadores.splice(args[0] + 1, 1);
  };
  //#endregion
}
