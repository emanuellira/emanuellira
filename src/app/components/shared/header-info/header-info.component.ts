/** [# version: 6.0.2 #] */
import { Component, Input, OnInit } from '@angular/core';
import { IEvento } from 'src/app/class/interfaces/evento.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { IUsuario } from 'src/app/class/interfaces/usuario.interface';
import { LangService } from 'src/app/services/lang.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header-info',
  templateUrl: './header-info.component.html',
  styleUrls: ['./header-info.component.css'],
})
export class HeaderInfoComponent implements OnInit {
  //#region [Propiedades]: Name->
  @Input() count = 0;
  @Input() label = '';
  @Input() show_expira = true;
  @Input() evento: IEvento = {};
  usuario: IUsuario;
  language!: iModuleLang;
  //#endregion
  constructor(private _login_: LoginService, private _lang_: LangService) {
    this.usuario = {
      IDUsuario: this._login_.IDUsuario,
      Tipo: this._login_.Tipo,
      Token: '',
      NomUsuario: this._login_.NomUsuario,
      NomSector: this._login_.NomSector,
      FechaExpira: this._login_.FechaExpira_Captura,
    };
  }

  ngOnInit(): void {
    this._lang_.modulo = 'headerinfo';
    this.language = this._lang_.language_by_modulo;
  }
}
