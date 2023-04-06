import { Component } from '@angular/core';
import { FlowerService } from '../flower.service';

@Component({
  selector: 'app-host-child',
  templateUrl: './host-child.component.html',
  styleUrls: ['./host-child.component.scss'],
})
export class HostChildComponent {
  constructor(public flower: FlowerService) {}
}
