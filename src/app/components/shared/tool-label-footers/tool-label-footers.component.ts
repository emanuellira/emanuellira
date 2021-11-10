/**[# version: 6.4.1 #] */
import { Component, Input, OnInit } from '@angular/core';
import { IKeyPair } from 'src/app/class/interfaces/keypair.interface';
@Component({
  selector: 'app-tool-label-footers',
  templateUrl: './tool-label-footers.component.html',
  styleUrls: ['./tool-label-footers.component.css'],
})
export class ToolLabelFootersComponent implements OnInit {
  //#region [Propiedades]:
  @Input() totales: Array<IKeyPair> = [];
  //#endregion
  constructor() {}

  ngOnInit(): void {
    // this.totales = this.totales.filter((f) => Number(f.value) > 0);
  }
}
