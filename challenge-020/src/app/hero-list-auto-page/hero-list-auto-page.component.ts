import { Component } from '@angular/core';
import { HEROES } from '../mock-heroes';

@Component({
  selector: 'app-hero-list-auto-page',
  templateUrl: './hero-list-auto-page.component.html',
  styleUrls: ['./hero-list-auto-page.component.scss'],
})
export class HeroListAutoCalcPageComponent {
  heroes = HEROES.slice();

  onRemove(id: number) {
    this.heroes = this.heroes.filter((hero) => hero.id !== id);
  }
}
