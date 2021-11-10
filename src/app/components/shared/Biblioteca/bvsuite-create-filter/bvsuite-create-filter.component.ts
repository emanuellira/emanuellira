//[# version: 7.5.6 #]
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  IDivAdmin2,
  IDivAdmin3,
} from 'src/app/class/interfaces/catalogo.interface';
import { IDictionary_Number } from 'src/app/class/interfaces/keypair.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { DbapiService } from 'src/app/services/dbapi.service';
import { LangService } from 'src/app/services/lang.service';
import { LoginService } from 'src/app/services/login.service';
import { BvsuiteFilterDanioComponent } from './bvsuite-filter-danio/bvsuite-filter-danio.component';
import { BvsuiteFilterEducativoComponent } from './bvsuite-filter-educativo/bvsuite-filter-educativo.component';
import { BvsuiteFilterUbicacionComponent } from './bvsuite-filter-ubicacion/bvsuite-filter-ubicacion.component';
declare var bootstrap: any;

@Component({
  selector: 'app-bvsuite-create-filter',
  templateUrl: './bvsuite-create-filter.component.html',
  styleUrls: ['./bvsuite-create-filter.component.css'],
})
export class BvsuiteCreateFilterComponent implements OnInit {
  //#region [Propiedades]:
  private _app_: number = -1;
  @Input() tipo: string = '';
  @Input() es_preliminar: boolean = false;
  firmas: Array<string> = [];
  es_reporte_filtro: boolean = false;
  departamentos: Array<IDivAdmin2> = [];
  municipios: Array<IDivAdmin3> = [];
  language!: iModuleLang;

  @ViewChild(BvsuiteFilterUbicacionComponent) //@ts-ignore
  comUbicacion: BvsuiteFilterUbicacionComponent;
  @ViewChild(BvsuiteFilterEducativoComponent) //@ts-ignore
  comEducativo: BvsuiteFilterEducativoComponent;
  @ViewChild(BvsuiteFilterDanioComponent) //@ts-ignore
  comCatDanio: BvsuiteFilterDanioComponent;
  //#endregion

  constructor(
    private _db_api_: DbapiService,
    private _alert_: AlertsService,
    private _login_: LoginService,
    private _lang_: LangService
  ) {}

  ngOnInit(): void {
    this._lang_.modulo = 'bvsuitefilter';
    this.language = this._lang_.language_by_modulo;
  }

  On_Show = (_tipo_: string, es_reporte_filtro: boolean = true) => {
    this.tipo = _tipo_;
    this.es_reporte_filtro = es_reporte_filtro;
    var myModal = new bootstrap.Modal(
      document.getElementById('biblioteca_virtual_filter'),
      {
        keyboard: false,
        backdrop: 'static',
      }
    );
    this.App = 0;
    myModal.show();
  };

  /**
   * @description Inicia los componentes para ejecutar la solicitud de info
   */
  set App(value: number) {
    const filters_dictionary: IDictionary_Number = {
      0: this.Get_Data_Ubicacion,
      1: this.Get_Data_Nivel_Educativo,
      2: this.Get_Data_CatDanio,
    };
    this._app_ = value;

    filters_dictionary[value]();
  }

  On_Generar_Documento = () => {
    const filters_dictionary: IDictionary_Number = {
      0: this.Create_Data_Ubicacion,
      1: this.Create_Data_Nivel_Educativo,
      2: this.Create_Data_CatDanio,
    };

    filters_dictionary[this._app_]();
  };

  //#region [Propiedades]: Name-> Menús
  get ubicacion() {
    return this._app_ === 0;
  }

  get nivel_educativo() {
    return this._app_ === 1;
  }

  get nivel_danio() {
    return this._app_ === 2;
  }

  get tipo_ambiente_evaluado() {
    return this._app_ === 3;
  }

  get matricula() {
    return this._app_ === 4;
  }
  //#endregion

  Generar_Documento = (data: string) => {
    this._alert_.SetLoading = this.language.generar_documento;
    let TIPO = this.tipo === 'WORD' ? 'DOC_WORD' : 'DOC_CSV';
    const _tipo_ = `${TIPO}_${this.es_preliminar ? 'PRE' : 'DEF'}`;
    this._db_api_
      .Get_Reportes_Filtro(
        _tipo_,
        data,
        this._login_.IDUsuario_Captura,
        this._login_.Sector_Captura,
        this._login_.IDEvento,
        this.firmas
      )
      .subscribe(
        (reporte) => {
          console.log(reporte.Url);
          if (reporte.Descripcion === '') {
            window.open(
              reporte.Url,
              '_blank',
              'resizable=yes,scrollbars=no,width="400",height="auto"'
            );
            this._alert_.Close();
          } else {
            this._alert_.Close();
            console.log(reporte);
            this._alert_.ShowWait(`${reporte.Descripcion}`, '', 'warning');
          }
        },
        (err) => {
          this._alert_.Close();
          console.error(err);
        }
      );
  };

  //#region [Function]: Name-> Ubicación
  Create_Data_Ubicacion = async () => {
    try {
      const data = (await this.comUbicacion.Get_Pipe_List()) as string;
      this.Generar_Documento(data);
    } catch (error) {
      this._alert_.ShowWait(error ?? this.language.no_se_pudo_realizar_conexion, '', 'error');
    }
  };
  Get_Data_Ubicacion = () => {
    if (this.departamentos.length > 0) return;
    this._alert_.SetLoading = this.language.preparando_info;
    this._db_api_.Get_Departamentos().subscribe(
      (departamentos) => {
        console.log(departamentos);
        this.departamentos = departamentos;
        this._alert_.Close();
      },
      (err) => {
        this._alert_.Close();
        console.error(err);
      }
    );
  };
  //#endregion

  //#region [Function]: Name-> Nivel_Educativo
  Create_Data_Nivel_Educativo = async () => {
    try {
      const data = (await this.comEducativo.Get_Pipe_List()) as string;
      this.Generar_Documento(data);
    } catch (error) {
      this._alert_.ShowWait(error ?? this.language.no_se_pudo_realizar_conexion, '', 'error');
    }
  };
  Get_Data_Nivel_Educativo = () => {
    // this.comEducativo.Get_DataNivEdu();
  };
  //#endregion

  //#region [Function]: Name-> Cat_Danio
  Create_Data_CatDanio = async () => {
    try {
      const data = (await this.comCatDanio.Get_Pipe_List()) as string;
      this.Generar_Documento(data);
    } catch (error) {
      this._alert_.ShowWait(error ?? this.language.no_se_pudo_realizar_conexion, '', 'error');
    }
  };
  Get_Data_CatDanio = () => {
    // this.comEducativo.Get_DataNivEdu();
  };
  //#endregion

  // //#region [Function]: Name-> Ubicación
  // Get_Data_Ubicacion() {
  //   // Todo->
  // }
  // //#endregion
  // //#region [Function]: Name-> Ubicación
  // Get_Data_Ubicacion() {
  //   // Todo->
  // }
  // //#endregion
  // //#region [Function]: Name-> Ubicación
  // Get_Data_Ubicacion() {
  //   // Todo->
  // }
  // //#endregion
}
