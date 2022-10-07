import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'awesome',
})
export class AwesomePipe implements PipeTransform {
  /** Precede the input string with the word "Awesome" */
  transform(phrase: string) {
    return phrase ? 'Awesome ' + phrase : '';
  }
}
