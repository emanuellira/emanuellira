// [# version: 6.4.3 #]
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ISectores } from 'src/app/class/interfaces/catalogo.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { DbapiService } from 'src/app/services/dbapi.service';
import { LangService } from 'src/app/services/lang.service';
declare var bootstrap: any;

@Component({
  selector: 'app-tool-lista-sectores',
  templateUrl: './tool-lista-sectores.component.html',
  styleUrls: ['./tool-lista-sectores.component.css'],
})
export class ToolListaSectoresComponent implements OnInit {
  sectores: Array<ISectores> = [];
  @Output() On_Sector_Select = new EventEmitter<any>();
  args1: string = '';
  args2: string = '';
  language!: iModuleLang;
  constructor(private _db_api_: DbapiService, private _alert_: AlertsService,  private _lang_: LangService) {}

  ngOnInit(): void {
    this._lang_.modulo = 'sectores';
    this.language = this._lang_.language_by_modulo;
  }

  On_Show = async (args: Array<string>, _path_: string) => {
    var myModal = new bootstrap.Modal(
      document.getElementById('mdl_lista_sectores'),
      {
        keyboard: false,
        backdrop: 'static',
      }
    );
    this.args1 = args[1];
    this.args2 = _path_;
    this.sectores = (await this.Get_Sectores()) as Array<ISectores>;
    // console.log(this.sectores);
    myModal.show();
  };

  Get_Sectores = () =>
    new Promise((resolve, reject) =>
      this._db_api_.Get_Sectores().subscribe(
        (sectores) => {
          resolve(sectores);
        },
        (err) => {
          this._alert_.FireToast(err.Descripcion ?? this.language.no_se_pudo_realizar_conexion, 'error');
          reject(err);
        }
      )
    );

  On_Item_Sector_Select = (_item_: ISectores) =>
    this.On_Sector_Select.emit([_item_.ClaveSector, this.args1, this.args2]);
}
