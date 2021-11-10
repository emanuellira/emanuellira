import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fstepper',
})
export class FstepperPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    const _datos_ = value;
    const idx = Number(args[0]);
    const _values_ = _datos_.split('|');
    const result = _values_.length > idx ? _values_[idx] : '';
    return result;
  }
}
