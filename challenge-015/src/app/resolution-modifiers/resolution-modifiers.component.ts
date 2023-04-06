import { Component } from '@angular/core';
import { FlowerService } from '../flower.service';
import { LeafService } from '../leaf.service';

@Component({
  selector: 'app-resolution-modifiers',
  templateUrl: './resolution-modifiers.component.html',
  styleUrls: ['./resolution-modifiers.component.scss'],
})
export class ResolutionModifiersComponent {
  name = 'Angular';
  constructor(public flower: FlowerService, public leaf: LeafService) {}
}
