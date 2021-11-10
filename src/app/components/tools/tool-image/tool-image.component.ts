import { Component, Input, OnInit } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';
import { LangService } from 'src/app/services/lang.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-tool-image',
  templateUrl: './tool-image.component.html',
  styleUrls: ['./tool-image.component.css'],
})
export class ToolImageComponent implements OnInit {
  @Input() h: IData = { campo: '', alias: '' };
  @Input() item: IDiags = {};
  IDSector: number = 0;
  ShowImage: boolean = false;
  language!: iModuleLang;

  constructor(private _login_: LoginService,  private _lang_: LangService) {}

  ngOnInit(): void {
    this._lang_.modulo = 'imagen';
    this.language = this._lang_.language_by_modulo;
    this.IDSector = this._login_.Sector_Captura;
  }

  Mostrar_Imagen = () => (this.ShowImage = true);

  Mostrar_Imagen_Completa = () => {
    const _url_imagen_: string = `${this._login_.config.imagenes}/Libro_Blanco/Evento_${this.item['IDEvento']}/Sector_${this.IDSector}/RespaldoFotografico/Activo_${this.item['IDActivo']}/${this.item[this.h.campo]}`;

    window.open(_url_imagen_, '_blank', 'resizable=yes,scrollbars=no,width="400",height="auto"');
  };
}
