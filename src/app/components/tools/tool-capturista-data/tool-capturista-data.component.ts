import { Component, Input, OnInit } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';

@Component({
  selector: 'app-tool-capturista-data',
  templateUrl: './tool-capturista-data.component.html',
  styleUrls: ['./tool-capturista-data.component.css'],
})
export class ToolCapturistaDataComponent implements OnInit {
  @Input() items: IDiags = {};
  @Input() headers: Array<IData> = [];
  constructor() {}

  ngOnInit(): void {}
}
