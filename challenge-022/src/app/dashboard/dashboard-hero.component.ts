import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Hero } from '../model/hero';

@Component({
  selector: 'dashboard-hero',
  template: `
    <button type="button" (click)="click()" class="hero">
      {{ hero.name | uppercase }}
    </button>
  `,
  styleUrls: ['./dashboard-hero.component.scss'],
})
export class DashboardHeroComponent {
  @Input() hero!: Hero;
  @Output() selected = new EventEmitter<Hero>();
  click() {
    this.selected.emit(this.hero);
  }
}
