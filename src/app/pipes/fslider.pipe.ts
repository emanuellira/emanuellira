//[# version: 6.4.1 #]
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fslider',
})
export class FsliderPipe implements PipeTransform {
  transform(value: string, ...args: string[]): unknown {
    const lista = args[0];
    const items_formato: Array<{ value:string, desc: string}> = [];
    const description = lista.split('|');
    description?.forEach((d) => {
      const format = d.split('¬');
      items_formato.push({ value: format[0], desc: format[1] });
    });
    const v = Number(value);
    for (const item of items_formato) {
      const vitem = Number(item.value);
      // console.log(v, item.value);
      if (v <= vitem) {
        // this.item[this.h.campo] = item.value;
        value = item.desc;
        break;
      }
    }
    // value = `${v * 100}%`;
    return value;
  }
}
