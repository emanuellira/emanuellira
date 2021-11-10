/** [# version: 6.4.11 #] */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { IDataAyuda } from 'src/app/class/interfaces/ayuda.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { DownloadService } from 'src/app/services/download.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-tool-ayuda',
  templateUrl: './tool-ayuda.component.html',
  styleUrls: ['./tool-ayuda.component.css'],
})
export class ToolAyudaComponent implements OnInit {
  @Output() OnSelectAyuda = new EventEmitter<any>();
  @Output() OnCloseVideo = new EventEmitter<any>();
  @Input() item_ayuda: IDataAyuda = { iconos: [], tips: [] };
  @Input() video: string = '';
  @Input() modulo: string = '';
  @Input() showVideo: boolean = false;
  video_URL: string = '';
  existVideo: boolean = false;
  language!: iModuleLang;

  constructor(private _download_: DownloadService,private _alert_: AlertsService,   private _lang_: LangService) {}

  ngOnInit(): void {
    this._lang_.modulo = 'ayuda';
    this.language = this._lang_.language_by_modulo;
    this.showVideo = false;

  }
  //#region [Function]: Name-> Buscar
  /**
   * @description Busca en cada campo de cada fila el valor tecleado en buscar.
   * Incluye al headers el encabezado: Titular
   */
  Cerrar_Ayuda = () => {
    this.showVideo = false;
    this.OnSelectAyuda.emit(false);
  };
  Open_Guia = () => {
    let url = this._download_.Url_Ayuda();
    let pdf_URL = `${url}guias/${this.modulo}/${this.item_ayuda.id}.pdf`;
    window.open(
      pdf_URL,
      '_blank',
      'resizable=yes,scrollbars=no,width="400",height="auto"'
    );
  };
  Show_Video = () => {
    if (this.existVideo) {
    if (this.showVideo) {
      this.showVideo = false;
    } else {
      this.showVideo = true;
    }
      this.video_URL = `config/json/ayuda/guias/${this.modulo}`;
    } else {
      this._alert_.ShowWait(this.language.sin_video, '', 'info');
    }
  };
  //#endregion

  //#region [Function]: Name-> Custom Pasos
  /**
   * @description Coloca los iconos en el texto de ayuda
   */
  //  Custom_Pasos = () => {
  //    this.paso_1.Texto = "Algo en label";
  // };
  //#endregion
}
