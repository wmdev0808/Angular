import { Component, Optional } from '@angular/core';
import { OptionalService } from '../optional.service';

@Component({
  selector: 'app-optional',
  templateUrl: './optional.component.html',
  styleUrls: ['./optional.component.scss'],
})
export class OptionalComponent {
  constructor(@Optional() public optional?: OptionalService) {}
}

// The OptionalService isn't provided here, in the @Injectable() providers array, or in the the NgModdule. If you remove @Optional() from the constructor, you'll get an error
