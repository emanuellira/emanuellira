/** [# version: 7.5.13 #] */
import {
  EventEmitter,
  AfterViewInit,
  Component,
  Input,
  Output,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IDataAyuda } from 'src/app/class/interfaces/ayuda.interface';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { IMenu } from 'src/app/class/interfaces/menu.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';
import { _MODULOS_AYUDA_ } from 'src/app/global/globals';
import { DownloadService } from 'src/app/services/download.service';
import { LangService } from 'src/app/services/lang.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements AfterViewInit, OnInit {
  //#region [Propiedades]:
  @Input() menus_items: Array<IMenu> = [];
  @Input() items_headers: Array<IData> = [];
  @Input() items: Array<IDiags> = [];
  @Input() items_ayuda: Array<IDataAyuda> = [];
  showAyuda: boolean = false;
  items_aux: Array<IDiags> = [];
  @Output() On_Item_Click = new EventEmitter<any>();
  @Output() On_Item_Change = new EventEmitter<any>();
  buscando: boolean = false;
  total: number = 0;
  formSearch: FormGroup;
  version = environment.version;
  ayuda_items: Array<IDataAyuda> = [];
  ayuda_item: IDataAyuda = { iconos: [], tips: [] };
  @Input() modulo: string = '';
  showVideo: boolean = false;
  video: string = '';
  language!: iModuleLang;
  //#endregion

  //#region [OnInit]:
  constructor(
    private _fb_: FormBuilder,
    private _download_: DownloadService,
    private _lang_: LangService
  ) {
    this.formSearch = this._fb_.group({});
  }

  ngOnInit(): void {
    this._lang_.modulo = 'navbar';
    this.language = this._lang_.language_by_modulo;
    // console.log(this.language);
    this.CrearFormulario();
    this.Get_Ayuda();
  }

  ngAfterViewInit(): void {}
  //#endregion

  //#region [Function]: Name-> Item Click
  Item_Click = (menu_item: string): void => {
    this.On_Item_Click.emit([menu_item]);
  };
  //#endregion

  //#region [Function]: Name-> Crear Form
  CrearFormulario = () => {
    this.formSearch = this._fb_.group({
      txtSearch: '',
    });
  };
  //#endregion

  //#region [Getters]: Name-> txtSearch
  get txtSearch() {
    return <FormControl>this.formSearch.get('txtSearch');
  }
  //#endregion

  //#region [Function]: Name-> Buscar
  /**
   * @description Busca en cada campo de cada fila el valor tecleado en buscar.
   * Incluye al headers el encabezado: Titular
   */
  Buscar = () => {
    // this.Change_Items();
    this.items_aux = [];
    this.buscando = true;
    const value = this.txtSearch.value;
    if (value) {
      const es_revision = [
        _MODULOS_AYUDA_[0].nombre,
        _MODULOS_AYUDA_[2].nombre,
        _MODULOS_AYUDA_[4].nombre,
        _MODULOS_AYUDA_[8].nombre,
      ].some((s) => s === this.modulo);

      if (es_revision)
        this.items_headers.push({ campo: 'Titular', alias: 'Capturista' });

      for (const item of this.items) {
        let contiene_dato: boolean = false;
        for (const h of this.items_headers) {
          const dato: string = String(item[h.campo]);
          console.log(dato, value);
          contiene_dato =
            String(dato.toLowerCase()).indexOf(value.toLowerCase()) >= 0;

          if (contiene_dato) {
            this.items_aux.push(item);
            console.log(`${h.campo} = ${dato}`);
            break;
          }
        }
      }
      console.log(this.items_aux.length);
      this.On_Item_Change.emit(this.items_aux);
    }
  };
  //#endregion

  //#region [Function]: Name-> Borrar Búsqueda
  Borrar_Busqueda = () => {
    this.items_aux = [];
    this.buscando = false;
    this.txtSearch.setValue('');
    this.On_Item_Change.emit();
  };
  //#endregion

  //#region [Function]: Name-> OnSelectAyuda
  /**
   * @description Selección del elemento de ayuda a mostrar en el Tool de Ayuda
   */
  OnSelectAyuda = (
    show: boolean,
    item_ayuda: IDataAyuda,
    _showVideo_: boolean
  ) => {
    // this.Change_Items();
    this.video = `${item_ayuda.id}.mp4`;
    this.showAyuda = show;
    this.showVideo = _showVideo_;
    this.ayuda_item = item_ayuda;
    // console.log(this.ayuda_item);
  };
  //#endregion

  //#region [Function]: Name-> Crea_Menu
  Get_Ayuda = () => {
    this._download_.Get_Json_Ayuda(this.modulo).subscribe(
      (ayuda) => {
        this.ayuda_items = ayuda;
      },
      (err) => {
        // Warning-> Capturar el error
        console.log(err);
      }
    );
  };
  //#endregion
}
