// [# version: 7.5.11 #]
import { Injectable } from '@angular/core';
import {
  IGrupos_Catalogos,
  ICatalogo,
} from '../class/interfaces/catalogo.interface';
import { IData } from '../class/interfaces/plantilla.interface';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  private _catalogos_: IGrupos_Catalogos = {};
  private _itemsHeaders_: IData[] = [];
  private _item_cat_: ICatalogo = {
    ID: 0,
    Descripcion: '',
    Grupo: '',
    Valor: '',
    Sectores: '',
  };
  private _lstNewCatalogo_: Array<ICatalogo> = [];
  //#region [Constructor]:
  constructor() {}
  //#endregion

  get Data() {
    return this._catalogos_;
  }

  set ItemHeaders(data: IData[]) {
    this._itemsHeaders_ = data;
    for (const h of this._itemsHeaders_) {
      if (h.lista) {
        this._lstNewCatalogo_ = [];
        const lista = h.lista.split('|');
        if (lista.length > 1) {
          lista.forEach((element) => {
            this._item_cat_ = {
              ID: 0,
              Descripcion: '',
              Grupo: '',
              Valor: '',
              Sectores: '',
            };
            this._item_cat_.Grupo = h.campo;
            this._item_cat_.Valor = element;
            this._lstNewCatalogo_.push(this._item_cat_);
          });
          this.New_Item(h.campo, this._lstNewCatalogo_);
        }
      }
    }
  }

  get ItemHeaders() {
    return this._itemsHeaders_;
  }

  set Data(value: IGrupos_Catalogos) {
    this._catalogos_ = value;
  }

  New_Item(_name_: string, _value_: Array<ICatalogo>) {
    this._catalogos_[_name_] = _value_;
  }

  Get_Item = (_propiedad_: string) => this._catalogos_[_propiedad_];

  Get_From_Clave_Valor = (_valor_: string) =>
    this._catalogos_.Clave.find((f) => f.Valor === _valor_);

  //#region [Function]: Name-> Get From Clave
  /**
   * @description Si no existe el grupo regresa undefined, si existe pero no encuentra el valor
   * regresa undefined o regresa el primero si el parámetro first es true
   * @param _valor_ Valor a buscar
   * @param _name_ El grupo donde se hará la búsqueda
   * @returns
   */
  Get_From_Clave = (
    _valor_: string,
    _name_: string,
    _first_: boolean = false
  ) =>
    this._catalogos_[_name_]
      ? _first_
        ? this._catalogos_[_name_][0]
        : this._catalogos_[_name_].find((f) => f.Valor === _valor_)
      : undefined;
  //#endregion

  Get_First = (_name_: string): ICatalogo => {
    const cat: Array<ICatalogo> = this._catalogos_[_name_] || [{}];
    return cat[0];
  };

  Set_Values_UnidadM = () => {
    this._lstNewCatalogo_ = [];
    let cat_ClaveM = this.Get_Item('ClaveM');
    cat_ClaveM.forEach((item) => {
      let sClaveM = item.Descripcion.split('~');
      this._item_cat_ = {
        ID: 0,
        Descripcion: '',
        Grupo: '',
        Valor: '',
        Sectores: '',
      };
      if (sClaveM.length > 1) {
        this._item_cat_.Grupo = 'UnidadM';
        this._item_cat_.Valor = sClaveM[1];
        const x = this._lstNewCatalogo_.find(
          (c) => c.Valor === this._item_cat_.Valor
        );
        if (!x) {
          this._lstNewCatalogo_.push(this._item_cat_);
        }
      }
    });
    this.New_Item('UnidadM', this._lstNewCatalogo_);
  };

  Get_PrecioUnitario_ByClave = (_cat_: string, _clave_: string) => {
    const itemClaveM = this._catalogos_[_cat_].find((c) => c.Valor === _clave_);
    if (itemClaveM) {
      let sDes = itemClaveM.Descripcion.split('~');
      if (sDes.length > 1) {
        return sDes[0];
      }
    }
    return '0';
  };
}
