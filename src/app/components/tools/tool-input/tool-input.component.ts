/** [# version: 6.4.10 #] */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IDictionary_String } from 'src/app/class/interfaces/keypair.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';
import { _PAIS_SECTOR_ } from 'src/app/global/globals';
import { LoginService } from 'src/app/services/login.service';
import { TotalesService } from 'src/app/services/totales.service';

@Component({
  selector: 'app-tool-input',
  templateUrl: './tool-input.component.html',
  styleUrls: ['./tool-input.component.css'],
})
export class ToolInputComponent implements OnInit {
  //#region [Propiedades]
  @Input() formato: string | undefined;
  @Input() req: string | undefined;
  @Input() h: IData = { campo: '', alias: '' };
  @Input() item: IDiags = {};
  @Output() On_Change_Data = new EventEmitter<any>();
  //#endregion

  //#region [OnInit]
  constructor(
    private _login_: LoginService,
    private _totales_: TotalesService
  ) {}

  ngOnInit(): void {
  }
  //#endregion

  //#region [Getters]: Name-> tipo
  get tipo() {
    if (!this.formato || this.formato === 'text') return 'text';
    if (this.formato === 'money') return 'number';

    return this.formato;
  }
  //#endregion

  /**
   * @description Primero busca si el sector tiene un método propio para
   * calcular los montos y sino ejecuta el cálculo de modo normal
   * @param _texto_ el nombre del campo que se está editando
   */
  On_Change = (_texto_: Event) => {
    const func_custom = this.Get_Monto_Custom(
      this._login_.config.pais_abrv || '',
      this._login_.Sector_Captura.toString()
    );
    let func;
    if (func_custom) {
      this._totales_.item = this.item;
      this._totales_.costoInicial = Number(this.item.CostoUnitario);
      func = func_custom(this.h.campo);
    } else {
      func = this.Get_Monto_Default(this.h.campo);
    }
    func && func.f();
    //Avisa que se realiza un cambio en el campo
    this.On_Change_Data.emit([this.h.campo]);
  };

  /**
   * @description
   * VIVIENDA: CostoUnitario * Unidades * CES2 (%)
   */
  Get_Monto_Custom = (_pais_abr_: string, _sector_: string) => {
    const vr_dictionary: IDictionary_String = {
      [_PAIS_SECTOR_._HND_2_]: this.Get_VR_Vivienda,
      [_PAIS_SECTOR_._GTM_2_]: this._totales_.Get_VR_Vivienda_Cabecera,
      [_PAIS_SECTOR_._PAN_2_]: this.Get_VR_Vivienda,
    };
    const key = `${_pais_abr_}_${_sector_}`;
    return vr_dictionary[key];
  };

  //#region [Function]: Name-> Get Valor de Reposición Vivienda
  private Get_VR_Vivienda = (campo: string) => {
    const funcs = [
      {
        campo: 'CostoUnitario',
        f: () => {
          this.item.CostoTotalObra = (
            Number(this.item.CES2) * this.Costo_Total_Obra()
          ).toString();
          this.item.CostoTotalR = this.Costo_Total_R().toString();
        },
      },
      {
        campo: 'Unidades',
        f: () => {
          this.item.CostoTotalObra = (
            Number(this.item.CES2) * this.Costo_Total_Obra()
          ).toString();
          this.item.CostoTotalR = this.Costo_Total_R().toString();
        },
      },
      {
        campo: 'CostoAdmin',
        f: () => (this.item.CostoTotalR = String(this.Costo_Total_R())),
      },
    ];

    return funcs.find((f) => f.campo === campo);
  };
  //#endregion

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
        campo: 'CostoUnitario',
        f: () => {
          this.item.CostoTotalObra = this.Costo_Total_Obra().toString();
          this.item.CostoTotalR = this.Costo_Total_R().toString();
        },
      },
      {
        campo: 'Unidades',
        f: () => {
          this.item.CostoTotalObra = this.Costo_Total_Obra().toString();
          this.item.CostoTotalR = this.Costo_Total_R().toString();
        },
      },
      {
        campo: 'CostoAdmin',
        f: () => {
          this.item.CostoTotalObra = this.Costo_Total_Obra().toString();
          this.item.CostoTotalR = this.Costo_Total_R().toString();
        },
      },
    ];

    return funcs.find((f) => f.campo === campo);
  };
  //#endregion

  Costo_Total_Obra = () =>
    Number(this.item.Unidades) * Number(this.item.CostoUnitario);

  Costo_Total_R = () =>
    Number(this.item.CostoAdmin) + Number(this.item.CostoTotalObra);
}
