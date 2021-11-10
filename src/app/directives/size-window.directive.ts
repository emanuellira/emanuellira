// [# version: 6.1.1 #]
import { Directive } from '@angular/core';

@Directive({
  selector: '[appSizeWindow]',
})
export class SizeWindowDirective {
  constructor() {}

  /**
   * @description Redimenciona el fondo adaptandolo a las dimensiones de
   * la ventana
   * @param e datos del window del explorador
   */
  // @HostListener('window:resize', ['$event'])
  // private OnResizeWindow(e: any) {
  //   const window = e.path[0];
  //   let fondo = this._el_.nativeElement as HTMLDivElement;
  //   fondo.style.width = `${window.innerWidth}px;`;
  //   fondo.style.height = `${Number(window.innerHeight) - 50}px;`;
  // }
}
