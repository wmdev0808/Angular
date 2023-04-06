import { Component, Optional, Self } from '@angular/core';
import { LeafService } from '../leaf.service';

@Component({
  selector: 'app-self-no-data',
  templateUrl: './self-no-data.component.html',
  styleUrls: ['./self-no-data.component.scss'],
})
export class SelfNoDataComponent {
  constructor(@Self() @Optional() public leaf?: LeafService) {}
}

// The app doesn't break because the value being available at self is optional.
// If you remove @Optional(), the app breaks.
