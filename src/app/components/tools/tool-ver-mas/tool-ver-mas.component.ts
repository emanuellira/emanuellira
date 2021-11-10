//[# version: 7.5.10 #]
import { Component, Input, OnInit } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import {
  IData,
  IEntrevista,
} from 'src/app/class/interfaces/plantilla.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { DbapiService } from 'src/app/services/dbapi.service';
import { DownloadService } from 'src/app/services/download.service';
import { LoginService } from 'src/app/services/login.service';
declare var bootstrap: any;
@Component({
  selector: 'app-tool-ver-mas',
  templateUrl: './tool-ver-mas.component.html',
  styleUrls: ['./tool-ver-mas.component.css'],
})
export class ToolVerMasComponent implements OnInit {
  @Input() items_entrevistado: IDiags = {};
  @Input() items_capturista: IDiags = {};
  //@Input() h: IData = { campo: '', alias: '' };
  entrevistado_items_headers: Array<IData> = [];
  capturista_items_headers: Array<IData> = [];
  // entrevistado: IEntrevista = {};
  @Input() IDActivo: number = 0;
  constructor(
    private _db_api_: DbapiService,
    private _download_: DownloadService
  ) {}

  ngOnInit(): void {}

  get NoEsNull() {
    return this.items_entrevistado !== null;
  }

  On_Show = (_item_: IDiags) => {
    this.items_capturista = _item_;

    this.Get_Entrevista();
    this.Get_Capturista();
    var myModal = new bootstrap.Modal(document.getElementById('ver_mas'), {
      keyboard: false,
      backdrop: 'static',
    });
    myModal.show();
  };

  public Get_Entrevista = () => {
    //console.log(Data_Entrevista);
    const Data_Entrevista = this._download_.EntrevistaJson;
    this.entrevistado_items_headers = Data_Entrevista;
    // console.log(this.items_capturista.IDActivo);
    this._db_api_
      .Get_Entrevistado(Number(this.items_capturista.IDActivo))
      .subscribe(
        (data) => {
          this.items_entrevistado = data;
          console.log(data);
        },
        (err) => {
          // this._alert_.FireToast(err);
          console.log(err);
        }
      );
  };

  public Get_Capturista = () => {
    const Data_Capturista = this._download_.CapturistaJson;
    this.capturista_items_headers = Data_Capturista;
    // console.log(Data_Capturista);
  };
}
