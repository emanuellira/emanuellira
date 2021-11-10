/** [# version: 6.4.11 #] */
import { Component, Input, OnInit } from '@angular/core';
import {
  ICatalogoTipo,
  ISectores,
} from 'src/app/class/interfaces/catalogo.interface';
import { UploadService } from 'src/app/services/upload.service';
import { AlertsService } from 'src/app/services/alerts.service';
import { DbapiService } from 'src/app/services/dbapi.service';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-tool-uploadcatalogo',
  templateUrl: './tool-uploadcatalogo.component.html',
  styleUrls: ['./tool-uploadcatalogo.component.css'],
})
export class ToolUploadcatalogoComponent implements OnInit {
  @Input() item: ISectores = { ID: 0, lst_cat: [], AbrevMin: '' };
  @Input() lst_cat: Array<ICatalogoTipo> = [];
  image: string = '';
  abreAux: string | undefined;
  hayError: boolean = false;
  language!: iModuleLang;

  // @ts-ignore
  // @ViewChild(ToolItemcatalogoComponent) itemCatalogo: ToolItemcatalogoComponent;
  constructor(
    private _upload_: UploadService,
    private _db_api_: DbapiService,
    private _alert_: AlertsService,
    private _lang_: LangService
  ) { }

  ngOnInit(): void {
    // this.item.LstCatalogos = [];
    this._lang_.modulo = 'uploadcatalogo';
    this.language = this._lang_.language_by_modulo;
    this.abreAux = this.item.AbrevMin?.toLowerCase();
    this.image = `${this.abreAux}_app.png`;
  }

  Enviar() {
    this.hayError = false;
    this.Start(0);
  }

  UpdateVersionCat = () =>
    new Promise((resolve, reject) => {
      this._db_api_.Get_Update_Ver_Cat_(this.item.ID || 0).subscribe(
        (resultado) => {
          if (resultado.Tipo !== null && resultado.Tipo !== "") {
            this._alert_.ShowWait(`${resultado.Tipo}`, '', 'error');
          } else {
            this._alert_.ShowWait(`${resultado.Descripcion}`, '', 'success');
          }
        },
        (err) => {
          this._alert_.Close();
          // Warning-> Capturar el error
          console.log(err);
        }
      );
    });

  private async Start(idx: number) {
    if (idx >= this.item.lst_cat.length) {
      if (!this.hayError) {
        await this.UpdateVersionCat();
      }
      return;
    }
    this._alert_.SetLoading = `${this.language.subir_catalogo} [${this.item.AbrevMin}] [${this.item.lst_cat[idx].label}]`;
    const Re_Start = (_idx_: number) => this.Start(++_idx_);

    const file: File | undefined = this.item.lst_cat[idx].file;
    if (file) {     
      let tipo = this.item.lst_cat[idx].label;
      let tipoCampoAux = '';
      let idSectorAux = 0;
      let tipoCampo = this.item.lst_cat[idx].campo;
      let idSector = this.item.ID;
      if (tipoCampo !== null && tipoCampo !== undefined) {
        tipoCampoAux = tipoCampo;
      }
      if (idSector !== null && idSector !== undefined) {
        idSectorAux = idSector;
      }     
      let date = new Date();
      let mes = date.getMonth() + 1;
      let day = date.getDay() + 1;
      let año = date.getFullYear();
      let hora = date.getHours();
      let min = date.getMinutes();
      let seg = date.getSeconds();
      let newName = `${this.item.AbrevMin}_${tipo}_Cat_${day}${mes}${año}_${hora}${min}${seg}`;
      let url = 'Catalogos';
      this._upload_.Upload(file, newName, url).subscribe(
        (resultado) => {
          this._db_api_
            .Catalogos_Insert(
              tipoCampoAux,
              resultado.Tipo,
              idSectorAux,
              0,
              0,
              []
            )
            .subscribe(
              (resultado) => {
                if (resultado.Tipo !== null && resultado.Tipo !== "") {
                  this._alert_.ShowWait(`${resultado.Tipo}`, '', 'error');
                  this.hayError = true;
                } else {
                  this._alert_.ShowWait(`${resultado.Descripcion}`, '', 'success');

                }
                Re_Start(idx);
              },
              (err) => {
                this._alert_.Close();
                Re_Start(idx);
                console.log(err);
              }
            );

          // this._alert_.Close();
          // Re_Start(idx);
        },
        (err) => {
          this._alert_.Close();
          Re_Start(idx);
          console.log(err);
        }
      );
    } else {
      this._alert_.Close();
      Re_Start(idx);
    }
  }
}
