//  [# version: 7.5.2 #]
import { Component, Input, OnInit } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';

@Component({
  selector: 'app-tool-check',
  templateUrl: './tool-check.component.html',
  styleUrls: ['./tool-check.component.css'],
})
export class ToolCheckComponent implements OnInit {
  @Input() h: IData = { campo: '', alias: '' };
  @Input() item: IDiags = {};

  constructor() {}

  ngOnInit(): void {}

  Change = (value: string) => {
    this.item[this.h.campo] = Number(value).toString();
    console.log(this.item);
  };
}
