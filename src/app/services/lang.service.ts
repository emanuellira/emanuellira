// [# version: 7.5.3 #]
import { Injectable } from '@angular/core';
import { iLang, iModuleLang } from '../class/interfaces/lang.interface';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  private _lang_!: iLang;
  // private _language_by_modulo_!: iModuleLang;
  private _modulo_: string = '';

  constructor() {}

  set language(value: iLang) {
    this._lang_ = value;
    // console.dir(value);
  }

  set modulo(value: string) {
    this._modulo_ = value;
  }

  get language_by_modulo(): iModuleLang {
    const dict: { [index: string]: iModuleLang } = {
      login: this._lang_.login_lang_,
      revision: this._lang_.revision_lang_,
      bvsuitecun: this._lang_.bvsuitecun_lang_,
      bvsuitefilter: this._lang_.bvsuitefilter_lang_,
      bvsuitecreate: this._lang_.bvsuite_create_lang_,
      toolvermas: this._lang_.toolvermas_lang_,
      navbar: this._lang_.navbar_lang_,
      headerinfo: this._lang_.headerinfo_lang_,
      dynamictable: this._lang_.dynamictable_lang_,
      footers: this._lang_.footers_lang_,
      options: this._lang_.options_lang_,
      eventos: this._lang_.eventos_lang_,
      usuarios: this._lang_.usuarios_lang_,
      catalogos: this._lang_.catalogos_lang_,
      cerrar_sesion: this._lang_.cerrar_sesion_lang_,
      sectores: this._lang_.lista_sectores_lang_,
      indicadores: this._lang_.indicadores_lang_,
      barchat: this._lang_.bar_chart_lang_,
      ubicacion: this._lang_.filter_ubicacion_lang_,
      educacion: this._lang_.filter_educacion_lang_,
      danio: this._lang_.filter_danio_lang_,
      alerts: this._lang_.alerts_lang_,
      ayuda: this._lang_.ayuda_lang_,
      imagen: this._lang_.imagen_lang_,
      itemcatalogo: this._lang_.item_catalogo_lang_,
      uploadcatalogo: this._lang_.upload_catalogo_lang_,
      hay_error: this._lang_.hay_error_lang_
    };
    // console.log(dict[this._modulo_], this._modulo_);
    // this.language_by_modulo = ;
    return dict[this._modulo_];
  }
}
