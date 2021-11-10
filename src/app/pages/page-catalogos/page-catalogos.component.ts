/** [# version: 7.4.3 #] */
import { Component, OnInit, ViewChild } from '@angular/core';
import { IMenu } from 'src/app/class/interfaces/menu.interface';
import { PATH_ } from 'src/app/global/globals';
import { AlertsService } from 'src/app/services/alerts.service';
import { DownloadService } from 'src/app/services/download.service';
import { DbapiService } from 'src/app/services/dbapi.service';
import { NavigationService } from 'src/app/services/navigation.service';
import {
  ICatalogoTipo,
  IGrupos_Catalogos,
  ISectores,
} from 'src/app/class/interfaces/catalogo.interface';
import { LoginService } from 'src/app/services/login.service';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { BvsuiteCreateFilterComponent } from 'src/app/components/shared/Biblioteca/bvsuite-create-filter/bvsuite-create-filter.component';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-page-catalogos',
  templateUrl: './page-catalogos.component.html',
  styleUrls: ['./page-catalogos.component.css'],
})
export class PageCatalogosComponent implements OnInit {
  menu_items: Array<IMenu> = [];
  btns_items: Array<IMenu> = [];
  catalogo_item: Array<ICatalogoTipo> = [];
  items: Array<ISectores> = [];
  class_cat: Array<IGrupos_Catalogos> = [];
  lst_InfoCat = [];
  lst_cat: Array<ICatalogoTipo> = [];
  modulo: string = '';
  // @ts-ignore
  @ViewChild(BvsuiteCreateFilterComponent) filter: BvsuiteCreateFilterComponent;
  language!: iModuleLang;

  constructor(
    private _alert_: AlertsService,
    private _download_: DownloadService,
    private _navigate_: NavigationService,
    private _db_api_: DbapiService,
    private _login_: LoginService,
    private _lang_ : LangService
  ) {}

  ngOnInit(): void {
    this.modulo = this._login_.Define_modulo('catalogos');
    // Para activar el json de lenguaje:
        // ~1. EL módulo
        this._lang_.modulo = 'revision';
        // ~2. La mima línea para cada módulo
        this.language = this._lang_.language_by_modulo;
    this.Crea_Menu();
    this._alert_.Close();
  }

  //#region [Function]: Name-> Item NavBar Clic
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

  /**
   * @name Solo sirve para mostrar un mensaje por si el item no tiene
   *   relacionado un evento
   */
  NoneEvent = (): void => {
    this._alert_.ShowWait(this.language.item_no_relacionado_evento, '');
  };
  //#endregion

  Actualizar = () => {
    this._alert_.SetLoading = this.language.obteniendo_info;
    this._db_api_.Get_Sectores().subscribe(
      (sectores) => {
        // Todo-> Tarea por hacer
        this.items = sectores;
        this.lst_InfoCat = [];
        this.items.forEach((sec) => {
          sec.lst_cat = [];
          this.catalogo_item.forEach((cat) => {
            let catAux: ICatalogoTipo = { ...cat };
            cat.size = '';
            sec.lst_cat?.push(catAux);
            // this.lst_cat.push(cat);
          });
          // console.log(sec.lst_cat);
        });
        this._alert_.Close();
      },
      (err) => {
        this._alert_.Close();
        console.log(err);
      }
    );
  };

  Cerrar_Sesion = () =>
    this._alert_
      .Confirm(this.language.cerrar_sesion)
      .then((choice: string) => {
        if (choice === 'ok') {
          this._navigate_.Next_View = { path: PATH_._CERRAR_SESION_ };
        }
      });

  Enviar = () => {
    //Cambio a edición
  };

  //#region [Function]: Name-> Crea_Menu
  Crea_Menu = () => {
    this._download_.Get_Json_Menus('catalogos').subscribe(
      (menu) => {
        // Todo-> Generar los menús
        // console.log('Creando el menú');
        // console.log(menu);

        this.menu_items = [
          {
            label: menu.nav[0].label,
            icon: menu.nav[0].icon,
            btn: menu.nav[0].btn,
            visible: menu.nav[0].visible,
            evento: this.Actualizar,
          },
          {
            label: menu.nav[1].label,
            icon: menu.nav[1].icon,
            btn: menu.nav[1].btn,
            visible: menu.nav[1].visible,
            evento: this.Cerrar_Sesion,
          },
        ];
        //Botones que van en la parte de daños
        this.btns_items = [
          {
            id: 0,
            label: menu.btn[0].label,
            icon: menu.btn[0].icon,
            btn: menu.btn[0].btn,
            visible: menu.btn[0].visible,
            evento: this.Enviar,
          },
        ];
        menu.catalogos.forEach((element) => {
          this.catalogo_item.push(element);
        });

        // console.log(this.catalogo_item);

        this._alert_.SetLoading =
          this.language.obteniendo_info_2;
        this.Actualizar();
      },
      (err) => {
        // Warning-> Capturar el error
        console.log(err);
      }
    );
  };
  //#endregion
}
