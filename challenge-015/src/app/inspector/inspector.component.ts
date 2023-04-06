import { Component } from '@angular/core';
import { AnimalService } from '../animal.service';
import { FlowerService } from '../flower.service';

@Component({
  selector: 'app-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.scss'],
})
export class InspectorComponent {
  constructor(public flower: FlowerService, public animal: AnimalService) {}
}
