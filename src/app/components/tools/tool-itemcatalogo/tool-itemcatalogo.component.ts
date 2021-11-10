import { Component, Input, OnInit } from '@angular/core';
import { ICatalogoTipo } from 'src/app/class/interfaces/catalogo.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-tool-itemcatalogo',
  templateUrl: './tool-itemcatalogo.component.html',
  styleUrls: ['./tool-itemcatalogo.component.css'],
})
export class ToolItemcatalogoComponent implements OnInit {
  @Input() item: ICatalogoTipo = {label :"", campo :""};
  @Input() isFirst: boolean = false;
  currentFile?: File;
  selectedFiles?: FileList;  
  unidad: Array<string> = ['bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb'];
  language!: iModuleLang;
  
  constructor( private _lang_: LangService) {}

  ngOnInit(): void {
    this._lang_.modulo = 'itemcatalogo';
    this.language = this._lang_.language_by_modulo;
    this.item.size = '';
    this.item.extension = '';
  }

  selectFile(event: any): void {    
    this.selectedFiles = event.target.files;
    this.currentFile = event.target.files[0];
    console.log(this.currentFile);
    if (this.currentFile) {
      this.item.extension = this.currentFile?.type;
      this.ToMegas(this.currentFile.size);
      this.item.file = this.currentFile;
    }    
  }

  ToMegas(val: number) {
    let conv = val;
    let countIndex = -1;
    let sizeResult = "";
    console.log(`Tamaño: ${ val}`);
    while (conv > 1) {
      conv = conv / 1024;
      countIndex ++;
    }
    sizeResult = `${(conv * 1024).toFixed(2)} ${this.unidad[countIndex]}`;
    this.item.size = sizeResult;
    console.log(sizeResult);
  } 
}
