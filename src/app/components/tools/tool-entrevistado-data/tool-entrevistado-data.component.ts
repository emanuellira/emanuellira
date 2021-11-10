import { Component, Input, OnInit } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';

@Component({
  selector: 'app-tool-entrevistado-data',
  templateUrl: './tool-entrevistado-data.component.html',
  styleUrls: ['./tool-entrevistado-data.component.css'],
})
export class ToolEntrevistadoDataComponent implements OnInit {
  @Input() items: IDiags = {};
  @Input() headers: Array<IData> = [];
  constructor() {}

  ngOnInit(): void {
  }
}
