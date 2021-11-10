//[# version: 6.4.7 #]
import { Injectable } from '@angular/core';
import { IDiags } from '../class/interfaces/diags.interface';
import { _PAIS_SECTOR_ } from '../global/globals';

@Injectable({
  providedIn: 'root',
})
export class TotalesService {
  items: Array<IDiags> = [];
  item: IDiags = {};
  costoInicial: number = 0;
  constructor() {}

  //#region [Function]: Name-> Costo Admin, Costo total D, Costo Total R
  Costo_Admin = () =>
    this.items.reduce((a, b: IDiags) => a + Number(b['CostoAdmin']), 0);

  Costo_Total_D = () =>
    this.items.reduce((a, b: IDiags) => a + Number(b['CostoTotalObra']), 0);

  Costo_Total_D_Alquiler = () =>
    this.items.reduce((a, b: IDiags) => a + Number(b['CostoTotalObra']), 0);

  Costo_Total = () =>
    this.items.reduce((a, b: IDiags) => a + Number(b['CostoTotalR']), 0);
  //#endregion

  /**
   * @returns Todas las vivienda con daño severo(.75) ó colapsadas(1)
   *
   */
  Get_Colapsados_MAY75 = (): Array<IDiags> =>
    this.items.filter((f) => Number(f.CES2) >= 0.75);

  /**
   *
   * @returns valor calculado: cosoto total obra (reposición) * 6%
   */
  Perdidas_VIV_6PER = (_monto_: number): number =>
    (_monto_ * 0.06);

  Get_VR_Vivienda_Cabecera = (h: string) => {
    let func = this.Costo_Total_Cabecera(h);
    func && func.f();
  };
  Costo_Total_Cabecera = (h: string) => {
    const funcs = [
      {
        campo: 'CostoUnitario',
        f: () => {
          this.CostoUnitarioPorUnidadesPorCES2();
        },
      },
      {
        campo: 'TipoZonaAfectada',
        f: () => {
          let porcCabecera = 0.15;
          let costo = 0;
          let importeCabecera = porcCabecera * Number(this.costoInicial);
          if (this.item.TipoZonaAfectada.toLowerCase() === 'rural') {
            costo = Number(this.item.CostoUnitario) + importeCabecera;
          } else {
            costo = Number(this.item.CostoUnitario) - importeCabecera;
          }
          this.item['CostoUnitario'] = costo.toString();
          this.item['CostoTotalObra'] = this.Item_Costo_Total_Obra().toString();
          this.item['CostoTotalR'] = this.Item_Costo_Total_R().toString();
          console.log(this.item.CostoAdmin);
          console.log(this.item.CostoTotalObra);

          console.log(this.item);

          this.Item_Costo_Total_Obra();
          this.Costo_Total_R();
        },
      },
      {
        campo: 'Clave',
        f: () => {
          this.item['CostoTotalObra'] = this.Item_Costo_Total_Obra().toString();
          this.item['CostoTotalR'] = (
            (1 - Number(this.item['CES2'])) *
            this.Costo_Total_R()
          ).toString();
        },
      },
      {
        campo: 'Unidades',
        f: () => {
          this.item['CostoTotalObra'] = this.Item_Costo_Total_Obra().toString();
          this.item['CostoTotalR'] = (
            (1 - Number(this.item['CES2'])) *
            this.Costo_Total_R()
          ).toString();
        },
      },
      {
        campo: 'CostoAdmin',
        f: () => (this.item['CostoTotalR'] = String(this.Costo_Total_R())),
      },
    ];

    return funcs.find((f) => f.campo === h);
  };

  Item_Costo_Total_Obra = () =>
    Number(this.item.Unidades) * Number(this.item.CostoUnitario);

  Item_Costo_Total_R = () => {
    return Number(this.item.CostoTotalObra) + Number(this.item.CostoAdmin);
  };

  Set_Costo_Adicional = (_per_: number) => {
    this.item.CostoAdmin = `${Number(this.item.CostoTotalObra) * _per_}`;
    this.item.CostoTotalR = `${this.Item_Costo_Total_R()}`;
    console.log(this.item.CostoTotalR);
    console.log(this.item);
  };

  Costo_Total_R = () =>
    Number(this.item.CostoTotalObra) + Number(this.item.CostoAdmin);

  //#region [Comments]:
  //- - - - Name-> Metodo para slider vivienda-Honduras

  Get_VR_Vivienda = (campo: string) => {
    const funcs = [
      {
        campo: 'CES2',
        f: () => {
          this.CostoUnitarioPorUnidadesPorCES2();
        },
      },
      {
        campo: 'CostoUnitario',
        f: () => {
          this.CostoUnitarioPorUnidadesPorCES2();
        },
      },
      {
        campo: 'Unidades',
        f: () => {
          this.CostoUnitarioPorUnidadesPorCES2();
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
          this.item.CostoTotalObra = this.Item_Costo_Total_Obra().toString();
          this.item.CostoTotalR = this.Costo_Total_R().toString();
        },
      },
      {
        campo: 'Unidades',
        f: () => {
          this.item.CostoTotalObra = this.Item_Costo_Total_Obra().toString();
          this.item.CostoTotalR = this.Costo_Total_R().toString();
        },
      },
      {
        campo: 'CostoAdmin',
        f: () => {
          this.item.CostoTotalObra = this.Item_Costo_Total_Obra().toString();
          this.item.CostoTotalR = this.Costo_Total_R().toString();
        },
      },
    ];

    return funcs.find((f) => f.campo === campo);
  };

  private CostoUnitarioPorUnidadesPorCES2() {
    this.item.CostoTotalObra = (
      Number(this.item.CES2) * this.Item_Costo_Total_Obra()
    ).toString();
    this.item.CostoTotalR = this.Costo_Total_R().toString();
  }
  //#endregion
}
