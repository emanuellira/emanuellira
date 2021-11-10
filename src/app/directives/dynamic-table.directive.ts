/** [# version: 6.3.10 #] */
import {
  EventEmitter,
  Directive,
  HostListener,
  Output,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appDynamicTable]',
})
export class DynamicTableDirective {
  //#region [Propiedades]:
  @Output() onScrollMax = new EventEmitter<any>();
  @Input() count = 0;
  index = 0;

  // h = 0;
  // is_up = false;
  int_up = 0;
  position = 0;
  bajando = false;
  //#endregion
  constructor() {}

  @HostListener('scroll', ['$event'])
  onScroll(e: any) {
    const scroll = e.path[0];
    const s_top = scroll.scrollTop + scroll.offsetHeight;
    const s_height = scroll.scrollHeight;
    const c_top = e.path[0].children[0].getBoundingClientRect().top;
    // console.log(c_top, this.position, scroll.scrollTop);

    if (c_top > this.position) {
      // console.log('Subiendo');
      this.bajando = false;
    } else {
      // console.log('Bajando');
      this.bajando = true;
    }

    this.position = c_top;

    if (scroll.scrollTop === 0 && this.index > 0 && !this.bajando) {
      this.index--;
      scroll.scrollTop = scroll.scrollHeight;
      this.onScrollMax.emit(this.index);
      // console.log('Top');
    }

    if (
      s_top > s_height &&
      Math.floor(this.count) > this.index &&
      this.bajando
    ) {
      this.index++;
      scroll.scrollTop = 0;
      // this.position = 0;
      this.onScrollMax.emit(this.index);
      // console.log('Bottom');
    }
    // console.log(this.index);
  }
}
