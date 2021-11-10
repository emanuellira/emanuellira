import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fswitch',
})
export class FswitchPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    return !value || String(value) === '0' ? 'No' : 'Si';
  }
}
