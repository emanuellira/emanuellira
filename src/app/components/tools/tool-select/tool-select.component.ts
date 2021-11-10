// [# version: 7.5.7 #]
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';
import { _PAIS_SECTOR_ } from 'src/app/global/globals';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { LoginService } from 'src/app/services/login.service';
import { TotalesService } from 'src/app/services/totales.service';

@Component({
  selector: 'app-tool-select',
  templateUrl: './tool-select.component.html',
  styleUrls: ['./tool-select.component.css'],
})
export class ToolSelectComponent implements OnInit {
  //#region [Propiedades]
  @Input() h: IData = { campo: '', alias: '' };
  @Input() item: IDiags = {};
  @Input() lista: Array<string> = [];
  @Output() On_Change_Data = new EventEmitter<any>();
  porcCabecera: number = 0;
  costoInicial: number = 0;
  indexChange: number = 0;
  // tipo:string='lista'
  //#endregion
  constructor(
    private _login_: LoginService,
    private _catalogos_: CatalogosService,
    private _totales_: TotalesService
  ) {}

  ngOnInit(): void {
    this.porcCabecera = 0;
    this.costoInicial = 0;
    this.indexChange = 0;
    // const grupo = this._catalogos_.Get_First(this.h.lista || '');
    // this.item[this.h.campo] = grupo?.Descripcion || '';
    // console.log(this.item);
  }

  Change_Select = (_item_selected_: any) => {
    let grupo;
    this._totales_.item = this.item;
    // } else {
    grupo = this._catalogos_.Get_From_Clave(
      _item_selected_,
      this.h.lista || ''
    );
    // console.log(_item_selected_, this.h.lista);
    // console.log(this._catalogos_.catalogos);
    // console.log(grupo);
    if (this.indexChange === 0)
      this.costoInicial = Number(this.item.CostoUnitario);
    this.indexChange++;
    if (grupo) {
      if (this.h.campo === 'Clave') {
        this.item.InfraDa = grupo?.Descripcion || '';
        this.item.Clave = _item_selected_;
        let precioU = this._catalogos_.Get_PrecioUnitario_ByClave(
          'ClaveM',
          _item_selected_
        );
        this.item.CostoUnitario = precioU;
      } else {
        this.item[this.h.campo] = grupo?.Descripcion || grupo?.Valor;
        console.log(grupo);
        // console.log(this.item);
      }
    } else {
      this.item[this.h.campo] = _item_selected_;
    }
    this._totales_.Item_Costo_Total_Obra();
    this._totales_.Costo_Total_R();
    const func_custom = this.Get_Monto_Custom(
      this._login_.config.pais_abrv || '',
      this._login_.Sector_Captura.toString()
    );
    let func;
    if (func_custom) {
      this._totales_.costoInicial = this.costoInicial;
      this._totales_.item = this.item;
      func_custom(this.h.campo);
    } else {
      func = this.Get_Monto_Default(this.h.campo);
      func && func.f();
    }
    //Avisa que se realiza un cambio en el campo
    this.On_Change_Data.emit([this.h.campo]);
  };

  /**
   * @description
   * VIVIENDA: CostoUnitario * Unidades * CES2 (%)
   */
  Get_Monto_Custom = (_pais_abr_: string, _sector_: string) => {
    const vr_dictionary: { [index: string]: any } = {
      [_PAIS_SECTOR_._GTM_2_]: this._totales_.Get_VR_Vivienda_Cabecera,
    };
    const key = `${_pais_abr_}_${_sector_}`;
    return vr_dictionary[key];
  };

  //#region [Function]: Name-> Get_Monto_Default
  /**
   * @description:
   * Unidades
   * CostoUnitario
   *  => CostoTotalObra = Unidades * CostoUnitario
   * CostoTotalR
   *  => CostoAdmin + CostoTotalObra
   * @param _texto_
   */
  Get_Monto_Default = (campo: string) => {
    const funcs = [
      {
        campo: 'Clave',
        f: () => {
          // console.log('Se ejecutó en Clave');
          this.item.CostoTotalObra = this._totales_
            .Item_Costo_Total_Obra()
            .toString();
          this.item.CostoTotalR = this._totales_.Costo_Total_R().toString();
        },
      },
      {
        campo: 'Unidades',
        f: () => {
          this.item.CostoTotalObra = this._totales_
            .Item_Costo_Total_Obra()
            .toString();
          this.item.CostoTotalR = this._totales_.Costo_Total_R().toString();
        },
      },
      {
        campo: 'CostoAdmin',
        f: () => {
          this.item.CostoTotalObra = this._totales_
            .Item_Costo_Total_Obra()
            .toString();
          this.item.CostoTotalR = this._totales_.Costo_Total_R().toString();
        },
      },
    ];

    return funcs.find((f) => f.campo === campo);
  };
  //#endregion
}
