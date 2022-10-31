import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number, showEllipsis: boolean) {
    const newValue = maxLength ? value.substring(0, maxLength) : value;
    return showEllipsis ? `${newValue}...` : newValue;
  }
}
