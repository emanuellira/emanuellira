import { Component, Input, OnInit } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';

@Component({
  selector: 'app-tool-textarea',
  templateUrl: './tool-textarea.component.html',
  styleUrls: ['./tool-textarea.component.css']
})
export class ToolTextareaComponent implements OnInit {
  @Input() h: IData = { campo: '', alias: '' };
  @Input() item: IDiags = {};
  constructor() { }

  ngOnInit(): void {
    // console.log(this.item);
  }

}
