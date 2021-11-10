//[# version: 6.4.1 #]
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IDictionary_String } from 'src/app/class/interfaces/keypair.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';
import { _PAIS_SECTOR_ } from 'src/app/global/globals';
import { LoginService } from 'src/app/services/login.service';
import { TotalesService } from 'src/app/services/totales.service';

@Component({
  selector: 'app-tool-slider',
  templateUrl: './tool-slider.component.html',
  styleUrls: ['./tool-slider.component.css'],
})
export class ToolSliderComponent implements OnInit {
  //#region [Propiedades]
  @Input() formato: string | undefined;
  @Input() req: string | undefined;
  @Input() h: IData = { campo: '', alias: '' };
  @Input() item: IDiags = {};
  // sDatos: Array<string> = [];
  // sDatosLbl: Array<string> = [];
  @Output() On_Change_Data = new EventEmitter<any>();
  items_formato: Array<{ value: string; desc: string }> = [];
  description: string = '';
  //#endregion
  constructor(
    private _login_: LoginService,
    private _totales_: TotalesService
  ) {}

  ngOnInit(): void {
    const description = this.h.lista?.split('|');
    description?.forEach((d) => {
      const format = d.split('¬');
      this.items_formato.push({ value: format[0], desc: format[1] });
    });
    this.On_Change();
  }

  On_Change = () => {
    const v = Number(this.item[this.h.campo]);
    for (const item of this.items_formato) {
      const vitem = Number(item.value);
      // console.log(v, item.value);
      if (v <= vitem) {
        this.item[this.h.campo] = item.value;
        this.description = item.desc;
        break;
      }
    }
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
      func = this._totales_.Get_Monto_Default(this.h.campo);
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
      [_PAIS_SECTOR_._HND_2_]: this._totales_.Get_VR_Vivienda,
      [_PAIS_SECTOR_._GTM_2_]: this._totales_.Get_VR_Vivienda_Cabecera,
      [_PAIS_SECTOR_._PAN_2_]: this._totales_.Get_VR_Vivienda,
    };
    const key = `${_pais_abr_}_${_sector_}`;
    return vr_dictionary[key];
  };
}
