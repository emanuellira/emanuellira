//[# version: 6.4.2 #]
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';

@Component({
  selector: 'app-tool-stepper',
  templateUrl: './tool-stepper.component.html',
  styleUrls: ['./tool-stepper.component.css'],
})
export class ToolStepperComponent implements OnInit {
  //#region [Propiedades]
  @Input() formato: string | undefined;
  @Input() req: string | undefined;
  @Input() h: IData = { campo: '', alias: '' };
  @Input() item: IDiags = {};
  sDatos: Array<string> = [];
  sDatosLbl: Array<string> = [];
  @Output() On_Change_Data = new EventEmitter<any>();
  //#endregion
  constructor() { }

  ngOnInit(): void {
    this.Get_Datos_Stepper();
  }

  Get_Datos_Stepper() {
    this.sDatos = this.item.CES2Activo.split('|');
    this.sDatosLbl = this.item.CES2Activo_lista.split('|');

  }

  SetStepper = (isResta: boolean, idx: number): void => {
    let value = Number(this.sDatos[idx]);
    if (isResta) {
      if (Number(this.sDatos[idx]) > 0) {
        value = Number(this.sDatos[idx]) - 1;
      }
    } else {
      value = Number(this.sDatos[idx]) + 1;
    }
    let valuePA = 0;
    this.sDatos[idx] = value.toString();
    this.sDatos.forEach(val => {
      valuePA = valuePA + Number(val);
    });
    this.item.PoblacionAfectada = valuePA.toString();
    this.item.CES2Activo = this.sDatos.join('|');
  };
}
