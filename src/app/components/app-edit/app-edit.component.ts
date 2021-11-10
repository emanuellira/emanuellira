// [# version: 6.3.7 #]
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGrupo_Sectores } from 'src/app/class/interfaces/catalogo.interface';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';

@Component({
  selector: 'app-app-edit',
  templateUrl: './app-edit.component.html',
  styleUrls: ['./app-edit.component.css'],
})
export class AppEditComponent implements OnInit {
  @Input() item: IDiags = {};
  @Input() sectores: IGrupo_Sectores = {};
  @Input() editar: boolean = false;
  @Input() IDAccion: number = 0;
  @Input() h: IData = { campo: '', alias: '' };
  @Output() On_Change_Row = new EventEmitter<any>();
  dynamic_items: Array<IDiags> = [];
  lista: Array<string> = [];
  lista_sectores: Array<string> = [];
  constructor() {}

  ngOnInit(): void {
  }

  get editable() {
    return !this.editar || !this.h.editable;
  }

  get control_editable() {
    return this.editar && this.h.editable;
  }

  get es_label() {
    return !(['switch', 'date', 'stepper', 'slider'].indexOf(this.h.tipo || '') >= 0);
  }

  get lista_stepper() {
    return this.h.lista ? this.h.lista.split('|') : [];
  }

  // Es_Cero = (value: string) => String(value) === '0';

  Get_Style_MinWidth = (campo: string) => {
    switch (campo) {
      case 'Observaciones':
      case 'Diagnostico':
      case 'Domicilio':
      case 'Restauracion':
      case 'Localidad':
      case 'InfraDa':
      case 'CES2Activo':
      case 'CES2':
        return '300px';
      case 'CostoUnitario':
      case 'CostoTotalObra':
      case 'CostoAdmin':
      case 'CostoTotalR':
        return '150px';
      default:
        return '75px';
    }
  };

  Get_Style_Left = (campo: string) => {
    switch (campo) {
      case 'Observaciones':
      case 'Diagnostico':
      case 'Domicilio':
      case 'Restauracion':
      case 'Localidad':
      case 'InfraDa':
        return 'left';

      case 'CostoUnitario':
      case 'CostoTotalObra':
      case 'CostoAdmin':
      case 'CostoTotalR':
        return 'right';

      default:
        return 'center';
    }
  };

  Es_Lista = (tipo: string | undefined): boolean => {
    //console.log(this.item);
    if (this.item[`${this.h.campo}_lista`])
      this.lista = this.item[`${this.h.campo}_lista`].split('|');
    else if (this.item[`${this.h.lista}_lista`])
      this.lista = this.item[`${this.h.lista}_lista`].split('|');

    return tipo === 'lista';
  };

  /**
   * @description Avisa que la fila está sufriendo cambios
   * @param args datos del campo
   * @returns
   */
  Change_Row = (args: Array<string>) =>
    this.On_Change_Row.emit([this.IDAccion, args[0]]);
}
