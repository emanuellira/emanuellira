/** [# version: 6.3.5 #] */
import { Component, OnInit } from '@angular/core';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { LangService } from 'src/app/services/lang.service';
declare var bootstrap: any;

@Component({
  selector: 'app-bvsuite-create-upload-notify',
  templateUrl: './bvsuite-create-upload-notify.component.html',
  styleUrls: ['./bvsuite-create-upload-notify.component.css'],
})
export class BvsuiteCreateUploadNotifyComponent implements OnInit {
  app: number = 0;
  tipo: string = '';
  es_preliminar: boolean = false;
  language!: iModuleLang;
  constructor(private _lang_: LangService) {}

  ngOnInit(): void {
    this._lang_.modulo = 'bvsuitecun';
    this.language = this._lang_.language_by_modulo;
  }

  On_Show = (_tipo_: string, _es_preliminar_: boolean = true) => {
    this.tipo = _tipo_;
    this.es_preliminar = _es_preliminar_;
    var myModal = new bootstrap.Modal(
      document.getElementById('biblioteca_virtual_suite'),
      {
        keyboard: false,
        backdrop: 'static',
      }
    );
    myModal.show();
  };

  get es_firma() {
    return this.app === 0;
  }
  get es_upload() {
    return this.app === 1;
  }
  get es_notificar() {
    return this.app === 2;
  }
}
