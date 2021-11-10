//[# version: 7.5.4 #]
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ICatalogo } from 'src/app/class/interfaces/catalogo.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-bvsuite-filter-danio',
  templateUrl: './bvsuite-filter-danio.component.html',
  styleUrls: ['./bvsuite-filter-danio.component.css'],
})
export class BvsuiteFilterDanioComponent implements OnInit {
  frm: FormGroup;
  private _CatDanio_: Array<string> = [];
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
    this._lang_.modulo = 'danio';
    this.language = this._lang_.language_by_modulo;
    this.CrearFormulario();
    this.Get_DataCatDanio();
  }

  //#region [Function]: Name-> Get_Muns, Get_Pipe_List
  private Get_CatDanio = () => {
    this._alert_.SetLoading = this.language.espere;
    this._alert_.Close();
  };

  Get_Pipe_List = () => {
    return new Promise((resolve, reject) => {
      let lista: Array<string> = [];
      this._CatDanio_.forEach((item) => {
        let sCat = item.split('¬');
        lista.push('CES2');
        lista.push(Number(sCat[0]).toString());
        lista.push('string');
        lista.push('OR');
        lista.push('');
      });
      resolve(lista.join('|'));
      reject(`${this.language.select_filtro}`);
    });
  };
  //#endregion

  //#region [Function]: Name-> Crear Form
  private CrearFormulario = () => {
    this.frm = this._fb_.group({
      selCatDanio: this._CatDanio_,
    });
    this.Get_CatDanio();
  };
  //#endregion

  //#region [Eventos]: Name-> On_Select_DIVADMIN2
  OnSelect_CatDanio = () => {
    this._CatDanio_ = this.selCatDanio.value;
  };
  //#endregion

  //#region [Getters]: Name-> selDIVADMIN2, selDIVADMIN2
  private get selCatDanio() {
    return <FormControl>this.frm.get('selCatDanio');
  }
  //#endregion

  //#region [Function]: Name-> Get_Headers
  public Get_DataCatDanio = () => {
    // Todo-> Leer los encabezados del json
    this.items = this._catalogos_.Get_Item('CES2');
    this.items.forEach((element) => {
      let sCat = element.Valor.split('¬');
      let sCatVal = sCat[1].split(':');
      element.Descripcion = sCatVal[0];
    });
    this.selCatDanio.setValue(this.items[0].Valor);
  };
  //#endregion
}
