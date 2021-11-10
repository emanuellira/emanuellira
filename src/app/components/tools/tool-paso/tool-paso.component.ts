/** [# version: 6.4.10 #] */
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DownloadService } from 'src/app/services/download.service';

@Component({
  selector: 'app-tool-paso',
  templateUrl: './tool-paso.component.html',
  styleUrls: ['./tool-paso.component.css'],
})
export class ToolPasoComponent implements OnInit {
  @Input() itemText: string = '';
  @Input() idx: number = 0;
  @Input() iconos: Array<string> = [];
  @Input() tips: Array<string> = [];
  tip: string = "";
  //@ts-ignore
  @ViewChild('txtPasoAyuda', { static: true }) public txtPaso: ElementRef;
  newText: string = '';
  show: boolean = false;

  constructor(
    private _download_: DownloadService) {    
  }

  ngOnInit(): void {
    this.Texto = this.itemText;
    this.tip = this.tips[this.idx];
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
  }

  set Texto(value: string) {
    //const pattern = /\[([^\]]+)]/g;
    //const newText = value.replace(pattern, "Se reemplazo");
    this.newText = value;
    for (const icon of this.iconos) {
      this.newText = this.newText.replace(`[${icon}]`, this.Icono(icon));
    }
    this.newText = `<label
    class="txt-paso col-10"
    style="text-align: start; padding-left: -50px"><strong> ${this.newText} </strong></label>`;
    this.show = true;
    //this.txtPaso.nativeElement.innerHTML = `${this.newText}`;
  }

  Icono(image: string) {
    let url = this._download_.Url_Ayuda();
    const htmlImage = `<img
    class="logos"
    width="auto"
    height="20"
    src="${url}iconos/${image}.png"/>`;
    return htmlImage;
  }
}
