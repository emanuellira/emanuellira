import { Component, Input, OnInit } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';

@Component({
  selector: 'app-tool-date',
  templateUrl: './tool-date.component.html',
  styleUrls: ['./tool-date.component.css']
})
export class ToolDateComponent implements OnInit {
  @Input() h: IData = { campo: '', alias: '' };
  @Input() item: IDiags = {};
  constructor() { }

  ngOnInit(): void {
  }

}
