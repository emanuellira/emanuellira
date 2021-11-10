/** [# version: 7.5.15 #] */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGrupo_Sectores } from 'src/app/class/interfaces/catalogo.interface';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IEvento } from 'src/app/class/interfaces/evento.interface';
import { IMenu } from 'src/app/class/interfaces/menu.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';
import { DbapiService } from 'src/app/services/dbapi.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
})
export class DynamicTableComponent implements OnInit {
  //#region [Propiedades]:
  @Input() items: Array<IDiags> = [];
  @Input() sectores: IGrupo_Sectores = {};
  @Input() items_headers: Array<IData> = [];
  @Input() btn_items: Array<IMenu> = [];
  @Input() editar: boolean = false;
  @Input() IDAccion: number = 0;
  @Input() IDUsuario: number = 0;
  @Input() IDData: string = '';
  @Output() On_Item_Click = new EventEmitter<any>();
  @Output() On_Change_Table = new EventEmitter<any>();
  count = 50;
  __index__ = 0;
  private _diag_temp_: IDiags = {};
  // @Input() catalogos: IGrupos_Catalogos = {};
  dynamic_items: Array<IDiags> = [];

  //#endregion

  constructor(private _db_api: DbapiService, private _login_: LoginService) {}

  //#region [OnInit]:
  ngOnInit(): void {
    let calcular_count = 50;
    while (calcular_count < this.items.length) {
      if (this.items.length - calcular_count < 10) {
        this.count += 10;
      }
      calcular_count += 50;
    }

    // console.log(this.count);
    this.Change_Items(0);
    // this.dynamic_items = this.items.slice(0, 100);

    this._db_api.btn_items_group = [];

    for (let item of this.items) {
      let btns: Array<IMenu> = [];

      for (let b of this.btn_items) {
        btns.push({ ...b });
      }

      for (let b of btns) {
        b.id = Number(item[this.IDData]);
      }

      this._db_api.btn_items_group.push(btns);
    }
    // console.log(this._db_api.btn_items_group);
  }
  //#endregion

  //#region [Function]: Name-> Change Items
  /**
   * @name Change_Items Cambia el conjunto de elementos mostrados en el scroll
   * @param _index_ El número del conjunto de elementos que se están mostrando
   * en el scroll
   */
  Change_Items = (
    _index_: number,
    _items_: Array<IDiags> | undefined = undefined
  ) => {
    this.__index__ = _index_ >= 0 ? _index_ : this.__index__;
    // console.log(this.__index__);
    this.dynamic_items = [];
    if (_items_) {
      this.dynamic_items = _items_.slice(
        this.__index__ * (this.count - 5),
        (this.__index__ + 1) * (this.count + 5)
      );
    } else {
      this.dynamic_items = this.items.slice(
        this.__index__ * (this.count - 5),
        (this.__index__ + 1) * (this.count + 5)
      );
    }
    //console.log(`index_Scroll: ${_index_}`);
  };

  set diag_temp(value: IDiags) {
    this._diag_temp_ = value;
  }
  Set_Items_OnShow_ByID_ = (_id_: string, _campo_: string) => {
    let diag: IDiags = this.dynamic_items.filter(
      (item) => Number(item['IDAccion']) === Number(_id_)
    )[0];

    for (let v of Object.getOwnPropertyNames(diag)) {
      diag[v] = this._diag_temp_[v];
    }
  };

  Set_Estatus_Revisado = (_id_: string, _campo_: string) => {
    let diag: IDiags = this.dynamic_items.filter(
      (item) => Number(item['IDAccion']) === Number(_id_)
    )[0];
    diag.Estatus = 'SIRED';

    // for (let v of Object.getOwnPropertyNames(diag)) {
    // 	diag[v] = this._diag_temp_[v];
    // }
  };

  Update_Estatus_Item = (_id_accion_: number) => {
    // console.log(_id_accion_);
    let item = this.dynamic_items.find(
      (f) => Number(f.IDAccion) === _id_accion_
    );
    // console.log(this.dynamic_items);
    if (item) {
      item.EstatusAseguramiento = 'SIRED';
      // console.log(item);
    }
  };
  //#endregion

  //#region [Function]: Name-> Item_Click
  /**
   * @name Item_Click
   * @param _menu_item_ Botón seleccionado
   * @param _id_data_ Id Acción para identificar el elemento
   */
  Item_Click = (_menu_item_: string, _id_data_: string): void => {
    this.On_Item_Click.emit([_menu_item_, _id_data_]);
  };
  //#endregion

  //#region [Function]: Name-> Show_Web
  /**
   * @name Show_Web
   * @description Evalúa si el existe la propiedad estatus, si existe busca la
   * palabra 'web' para determinar si se muestra en la fila del item
   * @param estatus hace referencia a si la propiedad se visualiza en la app
   * móvil y/o en la app web
   * @returns
   */
  Show_Web = (estatus: string | undefined): boolean =>
    estatus ? estatus?.indexOf('web') >= 0 : false;
  //#endregion

  Item_Editable = (_id_data_: string) => {
    return this.editar && this.IDAccion === Number(_id_data_);
  };

  Get_Btn_Items = (_id_data_: string) =>
    this._db_api.btn_items_group.filter(
      (g) => g[0] && g[0].id === Number(_id_data_)
    )[0];

  Set_Warning = (_item_: IEvento) => _item_.Eliminado === 1;

  Set_Tipo = (_item_: IDiags) => this._login_.Get_Tipo_By_Item(_item_.Tipo);

  Change_Table = (args: Array<string>) => this.On_Change_Table.emit(args);
}
