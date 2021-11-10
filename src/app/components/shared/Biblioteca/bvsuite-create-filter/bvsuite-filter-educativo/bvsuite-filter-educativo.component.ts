// [# version: 7.5.3 #]
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ICatalogo } from 'src/app/class/interfaces/catalogo.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-bvsuite-filter-educativo',
  templateUrl: './bvsuite-filter-educativo.component.html',
  styleUrls: ['./bvsuite-filter-educativo.component.css'],
})
export class BvsuiteFilterEducativoComponent implements OnInit {
  frm: FormGroup;
  private _Nivel_: Array<string> = [];
  items: ICatalogo[] = [];
  language!: iModuleLang;

  constructor(
    private _alert_: AlertsService,
    private _fb_: FormBuilder,
    private _catalogos_: CatalogosService,
    private _lang_: LangService
  ) {
    this.frm = this._fb_.group({});
  }

  ngOnInit(): void {
    this._lang_.modulo = 'educacion';
    this.language = this._lang_.language_by_modulo;
    this.CrearFormulario();
    this.Get_DataNivEdu();
  }
  //#region [Function]: Name-> Crear Form
  private CrearFormulario = () => {
    this.frm = this._fb_.group({
      selNIVELEDUCATIVO: this._Nivel_,
    });
    this.Get_NivEduc();
  };
  //#endregion
  //#region [Function]: Name-> Get_Muns, Get_Pipe_List
  private Get_NivEduc = () => {
    this._alert_.SetLoading = 'Espere...';

    this._alert_.Close();
  };

  Get_Pipe_List = () => {
    return new Promise((resolve, reject) => {
      let lista: Array<string> = [];
      this._Nivel_.forEach((item) => {
        lista.push('Nivel');
        lista.push(item);
        lista.push('string');
        lista.push('OR');
        lista.push('');
      });
      resolve(lista.join('|'));
      reject(`Debe seleccionar un filtro`);
    });
  };
  //#endregion

  //#region [Eventos]: Name-> On_Select_DIVADMIN2
  OnSelect_NIVELEDUCATIVO = () => {
    this._Nivel_ = this.selNIVELEDUCATIVO.value;
  };
  //#endregion

  //#region [Getters]: Name-> selDIVADMIN2, selDIVADMIN2
  private get selNIVELEDUCATIVO() {
    return <FormControl>this.frm.get('selNIVELEDUCATIVO');
  }

  // private get selDIVADMIN3() {
  //   return <FormControl>this.frm.get('selDIVADMIN3');
  // }

  // private get can_create_list(): boolean {
  //   this._IDDIVADMIN3_ = this.selDIVADMIN3.value;
  //   return this._IDDIVADMIN2_ !== '';
  // }
  //#endregion

  //#region [Function]: Name-> Get_Headers
  public Get_DataNivEdu = () => {
    // Todo-> Leer los encabezados del json
    this.items = this._catalogos_.Get_Item('Nivel');
    this.selNIVELEDUCATIVO.setValue(this.items[0].Valor);
  };
  //#endregion
}
